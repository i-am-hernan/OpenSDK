import { descriptionMap } from "../maps/decriptions";
import {
  getComponentPath,
  getComponentInterface,
} from "../maps/components";
import * as ts from "typescript";

interface ParsedProperty {
  name: string;
  type: string;
  strictType: string;
  required: boolean;
  additionalProperties?: { [name: string]: ParsedProperty };
  values?: string[];
  description?: string;
}

interface ImportInfo {
  sourceFile: ts.SourceFile;
  importClause?: ts.ImportClause;
}

/**
 * Get the interface name for checkout configuration
 * - v6.x uses CoreConfiguration
 * - v3.x-v5.x uses CoreOptions
 */
const getCheckoutInterfaceName = (version: string) => {
  const parsedVersion = version.replace(/^v/, "");
  const major = parseInt(parsedVersion.split(".")[0], 10);
  return major >= 6 ? "CoreConfiguration" : "CoreOptions";
};

/**
 * Get the path for checkout configuration types
 * - Before v3.13.2: src/core/types.ts
 * - v3.13.2+: packages/lib/src/core/types.ts
 */
const getCheckoutMainPath = (version: string) => {
  const parsedVersion = version.replace(/^v/, "");
  const [major, minor, patch] = parsedVersion.split(".").map(Number);

  // If version < 3.13.2
  if (
    major < 3 ||
    (major === 3 && minor < 13) ||
    (major === 3 && minor === 13 && (patch || 0) < 2)
  ) {
    return "src/core/types.ts";
  }
  return "packages/lib/src/core/types.ts";
};

export const processSDKTypes = async (
  version: string,
  configuration: string
) => {
  const parsedVersion = version.replaceAll("_", ".");

  let interfaceName: string | null;
  let mainPath: string | null;

  if (configuration === "checkout") {
    interfaceName = getCheckoutInterfaceName(parsedVersion);
    mainPath = getCheckoutMainPath(parsedVersion);
  } else {
    // Use the new component map for payment method components
    interfaceName = getComponentInterface(configuration, parsedVersion);
    mainPath = getComponentPath(configuration, parsedVersion);

    if (!interfaceName || !mainPath) {
      console.error(
        `Component "${configuration}" not found for version ${parsedVersion}`
      );
      return null;
    }
  }
  const url = `https://raw.githubusercontent.com/Adyen/adyen-web/refs/tags/${parsedVersion}/${mainPath}`;
  console.log("url: ", url);
  const map = descriptionMap as Record<string, string>;
  let imports: Record<string, ImportInfo> = {};

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw response;
    }

    const fileContent = await response.text();

    const sourceFile = ts.createSourceFile(
      mainPath,
      fileContent,
      ts.ScriptTarget.ES2015,
      true
    );

    // Process imports recursively
    const processImports = async (
      sourceFile: ts.SourceFile,
      basePath: string,
      depth = 0
    ) => {
      if (depth > 3) {
        return;
      }

      for (const statement of sourceFile.statements) {
        if (ts.isImportDeclaration(statement)) {
          const importPath = (statement.moduleSpecifier as ts.StringLiteral)
            .text;

          if (importPath.startsWith(".")) {
            const currentDir = basePath.substring(0, basePath.lastIndexOf("/"));
            let pathSegments = `${currentDir}/${importPath}`.split("/");
            const normalizedSegments: string[] = [];

            for (const segment of pathSegments) {
              if (segment === "..") {
                normalizedSegments.pop();
              } else if (segment !== "." && segment !== "") {
                normalizedSegments.push(segment);
              }
            }

            let resolvedPath = `${normalizedSegments.join("/")}`;
            let importUrls = [
              `https://raw.githubusercontent.com/Adyen/adyen-web/refs/tags/${parsedVersion}/${resolvedPath}.ts`,
              `https://raw.githubusercontent.com/Adyen/adyen-web/refs/tags/${parsedVersion}/${resolvedPath}/types.ts`,
              `https://raw.githubusercontent.com/Adyen/adyen-web/refs/tags/${parsedVersion}/${resolvedPath}/index.ts`,
              `https://raw.githubusercontent.com/Adyen/adyen-web/refs/tags/${parsedVersion}/${resolvedPath}.tsx`,
            ];

            for (const importUrl of importUrls) {
              let response = await fetch(importUrl, {
                headers: {
                  "Cache-Control":
                    "public, s-maxage=86400, stale-while-revalidate=43200",
                },
              });

              if (response.ok) {
                const content = await response.text();
                const importedFile = ts.createSourceFile(
                  resolvedPath,
                  content,
                  ts.ScriptTarget.ES2015,
                  true
                );
                imports[resolvedPath] = {
                  sourceFile: importedFile,
                  importClause: statement.importClause,
                };
                await processImports(importedFile, resolvedPath, depth + 1);
                break;
              }
            }
          }
        }
      }
    };

    // Start with depth 0
    await processImports(sourceFile, mainPath, 0);

    // After processing all imports

    const structureAdyenWebTypes = () => {
      // Create a single program with all files
      const program = ts.createProgram([mainPath], {});
      const checker = program.getTypeChecker();
      const result: { [name: string]: ParsedProperty } = {};

      // Helper function to process a property node recursively
      const processPropertyNode = (
        node: ts.PropertySignature | ts.MethodSignature,
        imports: Record<string, ImportInfo>
      ): ParsedProperty => {
        const name = node.name.getText();
        const type = node.type;
        let property: ParsedProperty = {
          name,
          type: getTypeString(type),
          strictType: type?.getText() || "string",
          required: !node.questionToken,
          description: map[name] ? map[name] : "",
        };

        if (!type || /^_/.test(name)) {
          return property;
        }

        // If it's a method signature, treat it as a function type
        if (ts.isMethodSignature(node)) {
          property.type = "function";
          property.strictType = type.getText();
          return property;
        }

        // Handle array types
        if (
          type.kind === ts.SyntaxKind.ArrayType ||
          (type.getText() && type.getText().endsWith("[]"))
        ) {
          property.type = "array";
          property.strictType = type.getText();
        }

        // Handle function types
        else if (
          type.kind === ts.SyntaxKind.FunctionType ||
          type.kind === ts.SyntaxKind.VoidKeyword ||
          (type.getText() &&
            (type.getText().includes("Promise") ||
              type.getText().includes("void"))) ||
          /^on/.test(name) ||
          /^before/.test(name)
        ) {
          property.type = "function";
          property.strictType = type.getText();
        }

        // Handle union types (enums)
        else if (type.kind === ts.SyntaxKind.UnionType) {
          const unionType = type as ts.UnionTypeNode;
          const filteredLiteralTypes = unionType.types.filter(
            (t) =>
              ts.isLiteralTypeNode(t) ||
              t.kind === ts.SyntaxKind.StringLiteral ||
              t.kind === ts.SyntaxKind.NullKeyword
          );
          if (filteredLiteralTypes.length > 0) {
            property.type = "enum";
            property.values = filteredLiteralTypes.map((t) => {
              if (ts.isLiteralTypeNode(t)) {
                return t.literal.getText().replace(/['"]/g, "");
              } else if (t.kind === ts.SyntaxKind.NullKeyword) {
                return "null";
              }
              return t.getText().replace(/['"]/g, "");
            });
          }
        }

        // Handle type literals (nested objects)
        else if (type.kind === ts.SyntaxKind.TypeLiteral) {
          property.type = "object";
          property.strictType = "object";
          property.additionalProperties = {};

          const typeLiteral = type as ts.TypeLiteralNode;
          typeLiteral.members.forEach((member) => {
            if (ts.isPropertySignature(member)) {
              const nestedProp = processPropertyNode(member, imports);
              if (property.additionalProperties) {
                property.additionalProperties[nestedProp.name] = nestedProp;
              }
            }
          });
        }

        // Handle type references
        else if (type.kind === ts.SyntaxKind.TypeReference) {
          property.type = "object";
          const typeRef = type as ts.TypeReferenceNode;
          const refName = typeRef.typeName.getText();
          property.strictType = refName;

          // Find referenced type in imports
          for (const [_, importInfo] of Object.entries(imports)) {
            importInfo.sourceFile.forEachChild((refNode) => {
              // Handle both interfaces and type aliases
              if (ts.isInterfaceDeclaration(refNode) && refNode.name.text === refName) {
                property.additionalProperties = {};

                // First handle heritage clauses (extends)
                if (refNode.heritageClauses) {
                  refNode.heritageClauses.forEach((clause) => {
                    if (clause.token === ts.SyntaxKind.ExtendsKeyword) {
                      clause.types.forEach((baseType) => {
                        const baseTypeName = baseType.expression.getText();
                        // Look for base interface in all imported files
                        for (const [_, baseImportInfo] of Object.entries(imports)) {
                          baseImportInfo.sourceFile.forEachChild((baseNode) => {
                            if (ts.isInterfaceDeclaration(baseNode) && baseNode.name.text === baseTypeName) {
                              baseNode.members.forEach((member) => {
                                if (ts.isPropertySignature(member)) {
                                  const baseProp = processPropertyNode(member, imports);
                                  if (property.additionalProperties) {
                                    property.additionalProperties[baseProp.name] = baseProp;
                                  }
                                }
                              });
                            }
                          });
                        }
                      });
                    }
                  });
                }

                // Then handle the interface's own members
                refNode.members.forEach((member) => {
                  if (ts.isPropertySignature(member)) {
                    const refProp = processPropertyNode(member, imports);
                    if (property.additionalProperties) {
                      property.additionalProperties[refProp.name] = refProp;
                    }
                  }
                });
              }
              // Add type alias handling
              else if (ts.isTypeAliasDeclaration(refNode) && refNode.name.text === refName) {
                // Handle union types in type aliases
                if (ts.isUnionTypeNode(refNode.type)) {
                  const unionType = refNode.type;
                  const filteredLiteralTypes = unionType.types.filter(
                    t => ts.isLiteralTypeNode(t) ||
                      t.kind === ts.SyntaxKind.StringLiteral ||
                      t.kind === ts.SyntaxKind.NullKeyword
                  );
                  if (filteredLiteralTypes.length > 0) {
                    property.type = "enum";
                    property.values = filteredLiteralTypes.map(t => {
                      if (ts.isLiteralTypeNode(t)) {
                        return t.literal.getText().replace(/['"]/g, "");
                      } else if (t.kind === ts.SyntaxKind.NullKeyword) {
                        return "null";
                      }
                      return t.getText().replace(/['"]/g, "");
                    });
                  }
                }
                // Existing type literal handling
                else if (ts.isTypeLiteralNode(refNode.type)) {
                  property.additionalProperties = {};
                  refNode.type.members.forEach((member) => {
                    if (ts.isPropertySignature(member)) {
                      const refProp = processPropertyNode(member, imports);
                      if (property.additionalProperties) {
                        property.additionalProperties[refProp.name] = refProp;
                      }
                    }
                  });
                }
                // Existing type reference handling
                else if (ts.isTypeReferenceNode(refNode.type)) {
                  const aliasedTypeRef = refNode.type;
                  const aliasedTypeName = aliasedTypeRef.typeName.getText();
                  // Recursively look up the aliased type
                  for (const [_, aliasImportInfo] of Object.entries(imports)) {
                    aliasImportInfo.sourceFile.forEachChild((aliasNode) => {
                      if ((ts.isInterfaceDeclaration(aliasNode) || ts.isTypeAliasDeclaration(aliasNode))
                        && aliasNode.name.text === aliasedTypeName) {
                        const aliasedProp = processPropertyNode(aliasNode as any, imports);
                        property.additionalProperties = aliasedProp.additionalProperties;
                      }
                    });
                  }
                }
              }
            });
          }
        }

        return property;
      };

      // Visit all source files to find types
      const visit = (node: ts.Node) => {
        if (ts.isInterfaceDeclaration(node) && node.name.text === interfaceName) {
          node.members.forEach((member) => {
            // Handle both property and method signatures
            if (ts.isPropertySignature(member) || ts.isMethodSignature(member)) {
              const propertyInfo = processPropertyNode(member, imports);
              result[propertyInfo.name] = propertyInfo;
            }
          });

          // Handle extends clause if it exists
          if (node.heritageClauses) {
            node.heritageClauses.forEach((clause) => {
              if (clause.token === ts.SyntaxKind.ExtendsKeyword) {
                clause.types.forEach((baseType) => {
                  const baseTypeName = baseType.expression.getText();
                  // Look for base interface in all imported files
                  for (const [_, importInfo] of Object.entries(imports)) {
                    importInfo.sourceFile.forEachChild((baseNode) => {
                      if (
                        ts.isInterfaceDeclaration(baseNode) &&
                        baseNode.name.text === baseTypeName
                      ) {
                        baseNode.members.forEach((member) => {
                          if (ts.isPropertySignature(member)) {
                            const propertyInfo = processPropertyNode(
                              member,
                              imports
                            );
                            result[propertyInfo.name] = propertyInfo;
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        }
        ts.forEachChild(node, visit);
      };

      ts.forEachChild(sourceFile, visit);

      return result;
    };

    const result = structureAdyenWebTypes();

    // Clean up
    imports = {};
    return result;
  } catch (error: any) {
    if (error instanceof Response) {
      const data = await error.json();
      console.error(JSON.stringify(data), { status: error.status });
    }
    console.error(JSON.stringify({ error: error.message }), { status: 500 });
  } finally {
    // No need to disconnect here as we're reusing connections
  }
}

// Helper function to get type string
function getTypeString(type: ts.TypeNode | undefined): string {
  if (!type) return "string";
  if (type.kind === ts.SyntaxKind.StringKeyword) return "string";
  if (type.kind === ts.SyntaxKind.NumberKeyword) return "number";
  if (type.kind === ts.SyntaxKind.BooleanKeyword) return "boolean";
  if (type.kind === ts.SyntaxKind.TypeLiteral) return "object";
  return "string";
}
