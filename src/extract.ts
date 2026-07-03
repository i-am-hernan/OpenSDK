/**
 * Adyen Web SDK Type Extractor
 *
 * Installs @adyen/adyen-web@<version> in an isolated temp directory,
 * resolves its public .d.ts declarations, parses them with ts-morph,
 * and generates a normalized schema JSON with $ref-style type references.
 *
 * Usage: npx ts-node src/extract.ts <version>
 * Example: npx ts-node src/extract.ts 6.34.0
 */

import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import {
  Project,
  SyntaxKind,
  InterfaceDeclaration,
  TypeAliasDeclaration,
  EnumDeclaration,
  Symbol as MorphSymbol,
  Node,
  Type,
  SourceFile,
} from "ts-morph";

const PKG_NAME = "@adyen/adyen-web";
const WORK_ROOT = "/tmp/sdk-extract/adyen-web";
const SCHEMA_DIR = path.resolve(__dirname, "../schemas");

// ---------------------------------------------------------------------------
// Schema types
// ---------------------------------------------------------------------------

type TypeDescriptor =
  | { kind: "primitive"; value: string }
  | { kind: "literal"; value: string }
  | { kind: "ref"; typeName: string }
  | { kind: "array"; elementType: TypeDescriptor }
  | { kind: "union"; types: TypeDescriptor[] }
  | { kind: "intersection"; types: TypeDescriptor[] }
  | { kind: "function"; signature: string }
  | { kind: "object"; properties: SDKProperty[] }
  | { kind: "unknown"; raw: string };

interface SDKProperty {
  name: string;
  type: TypeDescriptor;
  rawType: string;
  optional: boolean;
  readonly: boolean;
  jsDoc?: string;
  deprecated?: boolean;
}

interface SDKType {
  name: string;
  kind: "interface" | "type" | "enum" | "class" | "function" | "variable";
  exported: boolean;
  jsDoc?: string;
  deprecated?: boolean;
  properties?: SDKProperty[];
  enumMembers?: { name: string; value: string | undefined }[];
  rawType?: string;
}

interface SDKSchema {
  packageName: string;
  version: string;
  extractedAt: string;
  types: Record<string, SDKType>;
}

// ---------------------------------------------------------------------------
// 1. Install
// ---------------------------------------------------------------------------

function installPackage(version: string): string {
  const workDir = path.join(WORK_ROOT, version);
  const pkgDir = path.join(workDir, "node_modules", "@adyen", "adyen-web");

  if (fs.existsSync(path.join(pkgDir, "package.json"))) {
    console.log(`→ ${PKG_NAME}@${version} already installed, skipping.`);
    return workDir;
  }

  console.log(`→ Installing ${PKG_NAME}@${version}...`);
  fs.mkdirSync(workDir, { recursive: true });
  execSync("npm init -y", { cwd: workDir, stdio: "pipe" });
  execSync(`npm add ${PKG_NAME}@${version} --ignore-scripts`, {
    cwd: workDir,
    stdio: "pipe",
    timeout: 60_000,
  });
  console.log("  Done.");
  return workDir;
}

// ---------------------------------------------------------------------------
// 2. Resolve .d.ts entrypoint
// ---------------------------------------------------------------------------

function resolveEntrypoint(workDir: string): string {
  const pkgJsonPath = path.join(
    workDir,
    "node_modules",
    "@adyen",
    "adyen-web",
    "package.json"
  );
  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"));
  const pkgRoot = path.dirname(pkgJsonPath);

  let typesField: string | undefined;

  const dotExport = pkgJson.exports?.["."];
  if (dotExport?.import?.types) {
    typesField = dotExport.import.types;
  } else if (dotExport?.types) {
    typesField = dotExport.types;
  }

  if (!typesField) {
    typesField = pkgJson.types ?? pkgJson.typings;
  }

  if (!typesField) {
    throw new Error("No types entrypoint found in package.json");
  }

  let resolved = path.resolve(pkgRoot, typesField);

  if (fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()) {
    resolved = path.join(resolved, "index.d.ts");
  }

  if (!fs.existsSync(resolved)) {
    throw new Error(`Types entrypoint does not exist: ${resolved}`);
  }

  console.log(`→ Entrypoint: ${typesField}`);
  return resolved;
}

// ---------------------------------------------------------------------------
// 3. Extract types
// ---------------------------------------------------------------------------

// Primitives that should not be treated as $refs
const PRIMITIVES = new Set([
  "string", "number", "boolean", "void", "any", "unknown",
  "null", "undefined", "never", "object", "symbol", "bigint",
]);

// Track types we need to collect (referenced but not yet in the dict)
let pendingRefs: Set<string>;
let collectedTypes: Map<string, SDKType>;
let sourceFile: SourceFile;

function extractTypes(entrypoint: string): Record<string, SDKType> {
  console.log(`→ Parsing declarations...`);

  const project = new Project({
    compilerOptions: { noEmit: true },
    skipAddingFilesFromTsConfig: true,
  });

  project.addSourceFileAtPath(entrypoint);
  project.resolveSourceFileDependencies();

  sourceFile = project.getSourceFileOrThrow(entrypoint);
  const exportedDeclarations = sourceFile.getExportedDeclarations();

  console.log(`  ${project.getSourceFiles().length} declaration files loaded`);
  console.log(`  ${exportedDeclarations.size} exported symbols`);

  collectedTypes = new Map();
  pendingRefs = new Set();

  // Pass 1: extract all exported types
  for (const [name, declarations] of exportedDeclarations) {
    const decl = declarations[0];
    const sdkType = extractDeclaration(name, decl, true);
    collectedTypes.set(name, sdkType);
  }

  // Pass 2: resolve pending refs — collect non-exported types that are referenced
  const visited = new Set<string>();
  while (pendingRefs.size > 0) {
    const batch = [...pendingRefs];
    pendingRefs.clear();

    for (const refName of batch) {
      if (collectedTypes.has(refName) || visited.has(refName)) continue;
      visited.add(refName);

      // Search all source files in the project for this type
      const decl = findDeclarationByName(project, refName);
      if (decl) {
        const sdkType = extractDeclaration(refName, decl, false);
        collectedTypes.set(refName, sdkType);
      }
    }
  }

  console.log(`  ${collectedTypes.size} total types collected (including referenced)\n`);

  const result: Record<string, SDKType> = {};
  for (const [name, type] of collectedTypes) {
    result[name] = type;
  }
  return result;
}

function findDeclarationByName(project: Project, name: string): Node | null {
  for (const sf of project.getSourceFiles()) {
    // Check interfaces
    const iface = sf.getInterface(name);
    if (iface) return iface;

    // Check type aliases
    const typeAlias = sf.getTypeAlias(name);
    if (typeAlias) return typeAlias;

    // Check enums
    const enumDecl = sf.getEnum(name);
    if (enumDecl) return enumDecl;

    // Check classes
    const classDecl = sf.getClass(name);
    if (classDecl) return classDecl;
  }
  return null;
}

function extractDeclaration(name: string, decl: Node, exported: boolean): SDKType {
  if (decl.getKind() === SyntaxKind.InterfaceDeclaration) {
    return extractInterface(name, decl as InterfaceDeclaration, exported);
  } else if (decl.getKind() === SyntaxKind.TypeAliasDeclaration) {
    return extractTypeAlias(name, decl as TypeAliasDeclaration, exported);
  } else if (decl.getKind() === SyntaxKind.EnumDeclaration) {
    return extractEnum(name, decl as EnumDeclaration, exported);
  } else {
    return {
      name,
      kind: mapKind(decl.getKindName()),
      exported,
      jsDoc: getJsDoc(decl),
      deprecated: isDeprecated(decl),
    };
  }
}

function extractInterface(
  name: string,
  decl: InterfaceDeclaration,
  exported: boolean
): SDKType {
  const type = decl.getType();
  const properties = type.getProperties();

  return {
    name,
    kind: "interface",
    exported,
    jsDoc: getJsDoc(decl),
    deprecated: isDeprecated(decl),
    properties: properties.map((prop) => extractProperty(prop, decl)),
  };
}

function extractTypeAlias(
  name: string,
  decl: TypeAliasDeclaration,
  exported: boolean
): SDKType {
  const typeNode = decl.getTypeNode();
  const type = decl.getType();

  const properties = type.getProperties();
  const hasProperties =
    properties.length > 0 && !type.isUnion() && !type.isIntersection();

  return {
    name,
    kind: "type",
    exported,
    jsDoc: getJsDoc(decl),
    deprecated: isDeprecated(decl),
    rawType: typeNode?.getText(),
    properties: hasProperties
      ? properties.map((prop) => extractProperty(prop, decl))
      : undefined,
  };
}

function extractEnum(name: string, decl: EnumDeclaration, exported: boolean): SDKType {
  return {
    name,
    kind: "enum",
    exported,
    jsDoc: getJsDoc(decl),
    deprecated: isDeprecated(decl),
    enumMembers: decl.getMembers().map((m) => ({
      name: m.getName(),
      value: m.getValue()?.toString(),
    })),
  };
}

function extractProperty(prop: MorphSymbol, context: Node): SDKProperty {
  const propDecl = prop.getDeclarations()[0];
  const propType = prop.getTypeAtLocation(context);

  let rawType = propType.getText(context);
  rawType = rawType.replace(/import\("[^"]+"\)\./g, "");

  return {
    name: prop.getName(),
    type: describeType(propType, context, 0),
    rawType,
    optional: prop.isOptional(),
    readonly:
      propDecl?.getKind() === SyntaxKind.PropertySignature &&
      (propDecl as any).isReadonly?.() === true,
    jsDoc: propDecl ? getJsDoc(propDecl) : undefined,
    deprecated: propDecl ? isDeprecated(propDecl) : false,
  };
}

// ---------------------------------------------------------------------------
// Type descriptor builder
// ---------------------------------------------------------------------------

const MAX_DEPTH = 4;

function describeType(type: Type, context: Node, depth: number): TypeDescriptor {
  if (depth > MAX_DEPTH) {
    let raw = type.getText(context);
    raw = raw.replace(/import\("[^"]+"\)\./g, "");
    return { kind: "unknown", raw };
  }

  // Undefined
  if (type.isUndefined()) {
    return { kind: "primitive", value: "undefined" };
  }

  // Null
  if (type.isNull()) {
    return { kind: "primitive", value: "null" };
  }

  // Boolean literal (true | false from unions)
  if (type.isBooleanLiteral()) {
    return { kind: "literal", value: type.getText() };
  }

  // Literals (string, number)
  if (type.isStringLiteral()) {
    return { kind: "literal", value: type.getLiteralValue() as string };
  }
  if (type.isNumberLiteral()) {
    return { kind: "literal", value: String(type.getLiteralValue()) };
  }

  // Boolean (non-literal)
  if (type.isBoolean()) {
    return { kind: "primitive", value: "boolean" };
  }

  // Primitives
  if (type.isString()) return { kind: "primitive", value: "string" };
  if (type.isNumber()) return { kind: "primitive", value: "number" };
  if (type.isAny()) return { kind: "primitive", value: "any" };
  if (type.isUnknown()) return { kind: "primitive", value: "unknown" };
  if (type.isNever()) return { kind: "primitive", value: "never" };
  if (type.getText() === "void") return { kind: "primitive", value: "void" };
  if (type.getText() === "symbol") return { kind: "primitive", value: "symbol" };
  if (type.getText() === "bigint") return { kind: "primitive", value: "bigint" };

  // Union
  if (type.isUnion()) {
    const members = type.getUnionTypes().map((t) => describeType(t, context, depth + 1));
    return { kind: "union", types: members };
  }

  // Intersection
  if (type.isIntersection()) {
    const members = type.getIntersectionTypes().map((t) => describeType(t, context, depth + 1));
    return { kind: "intersection", types: members };
  }

  // Array
  if (type.isArray()) {
    const elementType = type.getArrayElementTypeOrThrow();
    return { kind: "array", elementType: describeType(elementType, context, depth + 1) };
  }

  // Function / callable
  const callSignatures = type.getCallSignatures();
  if (callSignatures.length > 0) {
    let sig = type.getText(context);
    sig = sig.replace(/import\("[^"]+"\)\./g, "");
    return { kind: "function", signature: sig };
  }

  // Named type (class, interface, type alias, enum) → $ref
  const symbol = type.getSymbol() || type.getAliasSymbol();
  if (symbol) {
    const typeName = symbol.getName();

    // Skip anonymous/internal types and primitives
    if (!PRIMITIVES.has(typeName) && typeName !== "__type" && typeName !== "__object") {
      pendingRefs.add(typeName);
      return { kind: "ref", typeName };
    }
  }

  // Inline object type (anonymous)
  const properties = type.getProperties();
  if (properties.length > 0) {
    return {
      kind: "object",
      properties: properties.map((p) => extractProperty(p, context)),
    };
  }

  // Fallback
  let raw = type.getText(context);
  raw = raw.replace(/import\("[^"]+"\)\./g, "");
  return { kind: "unknown", raw };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getJsDoc(node: Node): string | undefined {
  const jsDocs = (node as any).getJsDocs?.();
  if (!jsDocs || jsDocs.length === 0) return undefined;
  const text = jsDocs
    .map((d: any) => d.getDescription?.()?.trim())
    .filter(Boolean)
    .join("\n");
  return text || undefined;
}

function isDeprecated(node: Node): boolean {
  const jsDocs = (node as any).getJsDocs?.();
  if (!jsDocs) return false;
  return jsDocs.some((d: any) =>
    d.getTags?.()?.some((t: any) => t.getTagName?.() === "deprecated")
  );
}

function mapKind(kindName: string): SDKType["kind"] {
  if (kindName === "ClassDeclaration") return "class";
  if (kindName === "FunctionDeclaration") return "function";
  if (kindName === "VariableDeclaration") return "variable";
  if (kindName === "EnumDeclaration") return "enum";
  if (kindName === "TypeAliasDeclaration") return "type";
  return "interface";
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const version = process.argv[2];
  if (!version) {
    console.error("Usage: npx ts-node src/extract.ts <version>");
    console.error("Example: npx ts-node src/extract.ts 6.34.0");
    process.exit(1);
  }

  console.log(`\n=== Adyen Web SDK Type Extractor ===`);
  console.log(`Version: ${version}\n`);

  const workDir = installPackage(version);
  const entrypoint = resolveEntrypoint(workDir);
  const types = extractTypes(entrypoint);

  const schema: SDKSchema = {
    packageName: PKG_NAME,
    version,
    extractedAt: new Date().toISOString(),
    types,
  };

  fs.mkdirSync(SCHEMA_DIR, { recursive: true });
  const outPath = path.join(SCHEMA_DIR, `${version}.json`);
  fs.writeFileSync(outPath, JSON.stringify(schema, null, 2), "utf-8");
  console.log(`→ Schema written to ${outPath}`);

  // Print summary
  const typeList = Object.values(types);
  const exported = typeList.filter((t) => t.exported).length;
  const referenced = typeList.filter((t) => !t.exported).length;

  console.log(`\n=== SUMMARY ===`);
  console.log(`  Exported types: ${exported}`);
  console.log(`  Referenced (non-exported) types: ${referenced}`);
  console.log(`  Total: ${typeList.length}`);

  const configPattern = /Configuration|Config|Props|Options$/;
  const configTypes = typeList.filter(
    (t) =>
      (t.kind === "interface" || t.kind === "type") &&
      configPattern.test(t.name)
  );
  console.log(`  Configuration-like types: ${configTypes.length}`);
  console.log(`\n✓ Done.`);
}

main();
