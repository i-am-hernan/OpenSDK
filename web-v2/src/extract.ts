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
  ClassDeclaration,
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
  | { kind: "generic"; typeName: string; typeArguments: TypeDescriptor[] }
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
  /** From `@defaultValue` / `@default` — the SDK's value when omitted. */
  defaultValue?: string;
  /** From `@internal` — declared but not merchant-facing config. */
  internal?: boolean;
}

interface SDKType {
  name: string;
  kind: "interface" | "type" | "enum" | "class" | "function" | "variable";
  exported: boolean;
  jsDoc?: string;
  deprecated?: boolean;
  /** From `@internal` — declared but not merchant-facing config. */
  internal?: boolean;
  properties?: SDKProperty[];
  enumMembers?: { name: string; value: string | undefined }[];
  rawType?: string;
  /** Union/intersection aliases only: the structured target, members as refs. */
  type?: TypeDescriptor;
  /** Classes only: `extends UIElement<CardConfiguration>` → typeArguments: ["CardConfiguration"] */
  extendsType?: { typeName: string; typeArguments: string[] };
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

// Built-in generics carry their meaning in the type arguments, not the name —
// `Record<string, boolean>` as a bare `ref: Record` is useless. Expand these
// structurally instead of treating them as named aliases.
const UTILITY_TYPES = new Set([
  "Omit", "Pick", "Partial", "Required", "Readonly", "Record",
  "Exclude", "Extract", "NonNullable", "ReturnType", "Parameters",
  "InstanceType", "Awaited", "Array", "Promise", "Map", "Set",
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
  } else if (decl.getKind() === SyntaxKind.ClassDeclaration) {
    return extractClass(name, decl as ClassDeclaration, exported);
  } else {
    return {
      name,
      kind: mapKind(decl.getKindName()),
      exported,
      jsDoc: getJsDoc(decl),
      deprecated: isDeprecated(decl),
      internal: isInternal(decl) || undefined,
    };
  }
}

/**
 * Classes carry the txVariant → configuration link in their heritage clause:
 * `class CardElement extends UIElement<CardConfiguration>`. Without recording
 * it there is no way back from a variant's element class to the configuration
 * interface it accepts — the link checkoutLab's txVariant map is derived from.
 */
function extractClass(
  name: string,
  decl: ClassDeclaration,
  exported: boolean
): SDKType {
  const heritage = decl.getExtends();
  let extendsType: SDKType["extendsType"];

  if (heritage) {
    const typeName = heritage.getExpression().getText();
    const typeArguments = heritage.getTypeArguments().map((a) => a.getText());

    // Collect the base class and its type arguments so referenced
    // configuration types land in the schema even when not exported.
    if (!PRIMITIVES.has(typeName)) pendingRefs.add(typeName);
    for (const arg of typeArguments) {
      if (/^[A-Za-z_$][\w$]*$/.test(arg) && !PRIMITIVES.has(arg)) {
        pendingRefs.add(arg);
      }
    }

    extendsType = { typeName, typeArguments };
  }

  return {
    name,
    kind: "class",
    exported,
    jsDoc: getJsDoc(decl),
    deprecated: isDeprecated(decl),
    internal: isInternal(decl) || undefined,
    extendsType,
  };
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
    internal: isInternal(decl) || undefined,
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
  const isComposite = type.isUnion() || type.isIntersection();
  const hasProperties = properties.length > 0 && !isComposite;

  return {
    name,
    kind: "type",
    exported,
    jsDoc: getJsDoc(decl),
    deprecated: isDeprecated(decl),
    internal: isInternal(decl) || undefined,
    rawType: typeNode?.getText(),
    properties: hasProperties
      ? properties.map((prop) => extractProperty(prop, decl))
      : undefined,
    // Union and intersection aliases carry no properties, so without this they
    // reduce to a rawType string — useless to a renderer. Describing the target
    // (skipAlias, or it would ref itself) gives the members as refs instead.
    type: isComposite ? describeType(type, decl, 0, true) : undefined,
  };
}

function extractEnum(name: string, decl: EnumDeclaration, exported: boolean): SDKType {
  return {
    name,
    kind: "enum",
    exported,
    jsDoc: getJsDoc(decl),
    deprecated: isDeprecated(decl),
    internal: isInternal(decl) || undefined,
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
    defaultValue: propDecl ? getDefaultValue(propDecl) : undefined,
    internal: propDecl && isInternal(propDecl) ? true : undefined,
  };
}

// ---------------------------------------------------------------------------
// Type descriptor builder
// ---------------------------------------------------------------------------

const MAX_DEPTH = 4;

function describeType(
  type: Type,
  context: Node,
  depth: number,
  /** Set when describing an alias's own target, so it refs its members not itself. */
  skipAlias = false
): TypeDescriptor {
  if (depth > MAX_DEPTH) {
    let raw = type.getText(context);
    raw = raw.replace(/import\("[^"]+"\)\./g, "");
    return { kind: "unknown", raw };
  }

  // A named alias is a $ref, even when it resolves to a union or intersection.
  // This has to precede the union/intersection checks below: otherwise an alias
  // like `PaymentMethodsConfiguration` (an intersection of every payment
  // method's config) gets structurally inlined at every use site instead of
  // referenced once — which is what made DropinConfiguration 2.5MB on its own.
  if (!skipAlias) {
    const aliasSymbol = type.getAliasSymbol();
    if (aliasSymbol) {
      const typeName = aliasSymbol.getName();

      if (UTILITY_TYPES.has(typeName)) {
        // Built-in generic — the name alone says nothing, so keep the
        // arguments. Expanding it structurally instead would inline the whole
        // target at every use site (Partial<T> appears 149 times).
        return {
          kind: "generic",
          typeName,
          typeArguments: type
            .getAliasTypeArguments()
            .map((arg) => describeType(arg, context, depth + 1)),
        };
      }

      if (!PRIMITIVES.has(typeName) && typeName !== "__type") {
        pendingRefs.add(typeName);
        return { kind: "ref", typeName };
      }
    }
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

/** All `@tag` entries on a node, flattened across its JSDoc blocks. */
function getJsDocTags(node: Node): { name: string; text: string }[] {
  const jsDocs = (node as any).getJsDocs?.();
  if (!jsDocs) return [];
  return jsDocs.flatMap(
    (d: any) =>
      d.getTags?.()?.map((t: any) => ({
        name: t.getTagName?.() ?? "",
        text: (t.getCommentText?.() ?? "").trim(),
      })) ?? []
  );
}

function hasTag(node: Node, tagName: string): boolean {
  return getJsDocTags(node).some((t) => t.name === tagName);
}

function isDeprecated(node: Node): boolean {
  return hasTag(node, "deprecated");
}

/**
 * `@defaultValue` / `@default` — the value the SDK uses when the option is
 * omitted. Worth capturing: a config builder can seed the real default instead
 * of guessing one from the type.
 *
 * Adyen writes these as markdown code spans (``@defaultValue `true` ``), so the
 * backticks come off.
 */
function getDefaultValue(node: Node): string | undefined {
  const tag = getJsDocTags(node).find(
    (t) => t.name === "defaultValue" || t.name === "default"
  );
  if (!tag?.text) return undefined;

  // getCommentText() returns everything after the tag, which often continues
  // into prose:  `true`\n\n- merchant set config option
  // Take the leading code span when there is one, otherwise the first line.
  const span = tag.text.match(/^\s*`([^`]*)`/);
  const value = (span ? span[1] : tag.text.split("\n")[0]).trim();

  return value || undefined;
}

/** `@internal` — declared but not part of the merchant-facing config surface. */
function isInternal(node: Node): boolean {
  return hasTag(node, "internal");
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

/**
 * Extract one version end to end and write `schemas/<version>.json`.
 *
 * Exported so a batch run stays in a single process — spinning up ts-node per
 * version costs more than the extraction itself. Module-level parser state is
 * reset at the top of extractTypes(), so sequential calls are safe.
 */
export function extractVersion(version: string): { types: number } {
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
  // Indented for readability — these get opened and diffed by hand.
  // Costs ~2x on disk (1.1MB → 2.2MB) and ~70KB on the wire once gzipped
  // (80KB → 150KB), which the v4 route absorbs since it caches per version.
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

  return { types: typeList.length };
}

function main() {
  const version = process.argv[2];
  if (!version) {
    console.error("Usage: npm run extract -- <version>");
    console.error("Example: npm run extract -- 6.34.0");
    console.error("\nFor several versions at once: npm run seed:schemas -- <count>");
    process.exit(1);
  }

  extractVersion(version);
}

if (require.main === module) {
  main();
}
