import fs from "fs";
import path from "path";

import { convertTreeToNamespaceString, Tree } from "./endpointTypes.utils";
import { listExportsSync } from "./utils";

export const scanPlainModels = async (root: string) => {
  const imports: string[] = [];
  const tree: Tree = {};

  async function iterateDirectory(
    currentDirectory: string,
    currentTree: any,
    pathStack: string[],
  ) {
    const dirItems = fs.readdirSync(currentDirectory);

    for (const dirItem of dirItems) {
      const fullPath = path.join(currentDirectory, dirItem);
      const pathStats = fs.statSync(fullPath);

      // Clean the name for TypeScript compatibility (remove [ ], replace - and . with _)
      const cleanName = dirItem
        .replace(/\.ts$/, "")
        .replace(/\[|\]/g, "")
        .replace(/[-.]/g, "_");

      if (pathStats.isDirectory()) {
        currentTree[cleanName] = currentTree[cleanName] || {};
        await iterateDirectory(fullPath, currentTree[cleanName], [
          ...pathStack,
          dirItem,
        ]);
      } else if (dirItem.endsWith(".ts")) {
        const fileSignature = [
          "model",
          ...pathStack,
          dirItem.replace(".ts", ""),
        ]
          .join("_")
          .replace(/\[|\]/g, "")
          .replace(/[-.]/g, "_");

        // Initialize the namespace for the file
        currentTree[cleanName] = {};

        const actualFilePath = path.join(currentDirectory, dirItem);
        const exports = listExportsSync(actualFilePath);

        for (const exportedVariable of exports) {
          const importAlias = `${fileSignature}_${exportedVariable}`;
          const relativeImportPath =
            "./" +
            path
              .relative(process.cwd(), actualFilePath)
              .replace(/\\/g, "/")
              .replace(/\.ts$/, "");

          // 1. Add to top-level imports
          imports.push(
            `import { ${exportedVariable} as ${importAlias} } from "${relativeImportPath}";`,
          );

          // 2. Add to tree with Zod inference
          currentTree[cleanName][exportedVariable] =
            `__CODE_START__z.infer<typeof ${importAlias}>__CODE_END__`;
        }
      }
    }
  }

  await iterateDirectory(root, tree, []);

  const namespaceContent = convertTreeToNamespaceString(tree, "models");

  // Combine imports and the namespace
  return namespaceContent;
};
