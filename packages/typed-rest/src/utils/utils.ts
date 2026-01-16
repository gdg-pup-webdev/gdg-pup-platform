import path from 'path';
import fs from 'fs';
import ts from "typescript"; 

export async function checkExport(filePath: string, exportName: string) {
  try {
    // Resolve absolute path for dynamic import
    const absolutePath = path.resolve(filePath);
    
    // Import the module
    const module = await import(absolutePath);
    
    // Check if key exists
    return exportName in module;
  } catch (e) {
    console.error(`Error loading file ${filePath}:`, e);
    return false;
  }
}

export function checkExportSync(filePath: string, exportName: string): boolean {
  const content = fs.readFileSync(filePath, "utf-8");
  
  // Matches: 
  // 1. export const name... 
  // 2. export function name...
  // 3. export { name }
  const regex = new RegExp(
    `export\\s+(const|let|var|function|class|type|interface)\\s+${exportName}\\b|export\\s*{[^}]*\\b${exportName}\\b[^}]*}`,
    'g'
  );

  return regex.test(content);
}


// import path from 'path';
import { pathToFileURL } from 'url'; // Built-in Node utility

export async function listExportsAsync(filePath: string) {
  try {
    // 1. Get the absolute system path (e.g., C:\Users\...)
    const absolutePath = path.resolve(filePath);

    // 2. Convert to file:// URL (e.g., file:///C:/Users/...)
    const fileUrl = pathToFileURL(absolutePath).href;

    // 3. Import using the valid URL
    const module = await import(fileUrl);
    
    return Object.keys(module); 
  } catch (e) {
    console.error(`Error loading file ${filePath}:`, e);
    return [];
  }
}


export function listExportsSync(filePath: string): string[] {
  const content = fs.readFileSync(filePath, "utf-8");
  
  // Parse the file into an AST (Abstract Syntax Tree)
  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true
  );

  const exportNames: string[] = [];

  // Helper to check if a node has the 'export' modifier
  const isExported = (node: ts.Node): boolean => {
    return ts.canHaveModifiers(node) && 
           ts.getModifiers(node)?.some(m => m.kind === ts.SyntaxKind.ExportKeyword) || false;
  };

  // Walk through the top-level statements
  sourceFile.forEachChild(node => {
    // 1. Named exports: export const x, export function y, export class z
    if (isExported(node)) {
      if (ts.isVariableStatement(node)) {
        node.declarationList.declarations.forEach(decl => {
          if (ts.isIdentifier(decl.name)) {
            exportNames.push(decl.name.text);
          }
        });
      } else if (
        (ts.isFunctionDeclaration(node) || ts.isClassDeclaration(node) || ts.isModuleDeclaration(node)) &&
        node.name
      ) {
        exportNames.push(node.name.text);
      }
    }

    // 2. Export declarations: export { a, b as c }
    if (ts.isExportDeclaration(node) && node.exportClause && ts.isNamedExports(node.exportClause)) {
      node.exportClause.elements.forEach(element => {
        exportNames.push(element.name.text);
      });
    }
  });

  return [...new Set(exportNames)]; // Remove duplicates
}