import { promises as fs } from "fs";
import path from "path";
import { Project, SyntaxKind, VariableDeclaration } from "ts-morph";
import { listExportsSync } from "./utils.js";

export type TsFile = {
  path: string;
  pathSegments: string[];
};

/**
 * Recursive function that scans for .ts files in a directory
 * - returns all .ts files in a flat array
 */
export const scanFilesInDirectory = async (dir: string): Promise<TsFile[]> => {
  const files: TsFile[] = [];

  async function iterate(currentDir: string, segments: string[]) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        await iterate(fullPath, [...segments, entry.name]);
      } else if (entry.isFile() && entry.name.endsWith(".ts")) {
        files.push({
          path: fullPath,
          pathSegments: [...segments, entry.name],
        });
      }
    }
  }

  await iterate(dir, []);
  return files;
};

export function getFileExports(filePath: string) {
  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(filePath);

  const exportedDeclarations = sourceFile.getExportedDeclarations();

  return Array.from(exportedDeclarations.entries()).map(
    ([name, declarations]) => {
      const decl = declarations[0];

      // Handle the case where decl might be undefined
      if (!decl) {
        return {
          name,
          kind: "Unknown",
          isType: false,
        };
      }

      return {
        name,
        kind: decl.getKindName(),
        isType: isTypeOnly(decl),
      };
    },
  );
}

export function getVariableExports(filePath: string) {
  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(filePath);
  const exportedDeclarations = sourceFile.getExportedDeclarations();

  const variables: { name: string; node: VariableDeclaration }[] = [];

  for (const [name, declarations] of exportedDeclarations) {
    for (const decl of declarations) {
      // Check if the declaration is specifically a VariableDeclaration
      if (decl.getKind() === SyntaxKind.VariableDeclaration) {
        variables.push({
          name,
          node: decl as VariableDeclaration,
        });
      }
    }
  }

  return variables;
}

export function getVariableExportNames(filePath: string): string[] {
  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(filePath);

  return Array.from(sourceFile.getExportedDeclarations().entries())
    .filter(([_, decls]) =>
      decls.some((d) => d.getKind() === SyntaxKind.VariableDeclaration),
    )
    .map(([name]) => name);
}

// Update the helper to handle the potential undefined as well
function isTypeOnly(decl: any): boolean {
  if (!decl) return false;

  const kind = decl.getKind();
  return [
    SyntaxKind.InterfaceDeclaration,
    SyntaxKind.TypeAliasDeclaration,
    SyntaxKind.EnumDeclaration,
  ].includes(kind);
}

export async function ListExportOfFilesInDirectory(dir: string) {
  const files = await scanFilesInDirectory(dir);

  const imports: string[] = [];
  const listedFiles: any = [];

  files.forEach((file) => {
    const importFile =
      "./routes/" + file.pathSegments.join("/").replace(".ts", ".js");

    const routePath = file.pathSegments
      .slice(0, -1)
      .join("/")
      .replace(".ts", "")
      .replace(/\[(\w+)\]/g, "{$1}"); // Converts [param] to {param}
    const method = file.pathSegments
      .slice(-1)[0]
      ?.replace(".ts", "")
      .toLowerCase();

    const fileExports = listExportsSync(file.path); 

    const exportObjects: any = {
      method: method,
      path: "/" + routePath,
    };

    fileExports.forEach((exportedVar) => {
      // This replaces ANY of these characters: / \ { } ( ) - .
      const importAlias =
        `${routePath}_${method}_${exportedVar}_foropenapischema`.replace(
          /[\/\\{}\(\)\-\.]/g,
          "_",
        );
      imports.push(
        `import { ${exportedVar} as ${importAlias} } from "${importFile}";`,
      );
      exportObjects[exportedVar] = `__CODE_START__${importAlias}__CODE_END__`;
    });

    listedFiles.push(exportObjects);
  });

  return { listedFiles, imports };
}
