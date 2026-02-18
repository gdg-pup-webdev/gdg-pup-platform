import fsSync from "fs";
import ts from "typescript";


/**
 * Scan a ts file
 * list all of the keywords it exports
 */

export function listExportsSync(absolutePath: string): string[] {
  const content = fsSync.readFileSync(absolutePath, "utf-8");

  // Parse the file into an AST (Abstract Syntax Tree)
  const sourceFile = ts.createSourceFile(
    absolutePath,
    content,
    ts.ScriptTarget.Latest,
    true
  );

  const exportNames: string[] = [];

  // Helper to check if a node has the 'export' modifier
  const isExported = (node: ts.Node): boolean => {
    return (
      (ts.canHaveModifiers(node) &&
        ts
          .getModifiers(node)
          ?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) ||
      false
    );
  };

  // Walk through the top-level statements
  sourceFile.forEachChild((node) => {
    // 1. Named exports: export const x, export function y, export class z
    if (isExported(node)) {
      if (ts.isVariableStatement(node)) {
        node.declarationList.declarations.forEach((decl) => {
          if (ts.isIdentifier(decl.name)) {
            exportNames.push(decl.name.text);
          }
        });
      } else if ((ts.isFunctionDeclaration(node) ||
        ts.isClassDeclaration(node) ||
        ts.isModuleDeclaration(node)) &&
        node.name) {
        exportNames.push(node.name.text);
      }
    }

    // 2. Export declarations: export { a, b as c }
    if (ts.isExportDeclaration(node) &&
      node.exportClause &&
      ts.isNamedExports(node.exportClause)) {
      node.exportClause.elements.forEach((element) => {
        exportNames.push(element.name.text);
      });
    }
  });

  return [...new Set(exportNames)]; // Remove duplicates
}
