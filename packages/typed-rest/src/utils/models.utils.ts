import fs from "fs";
import path from "path";
import { listExportsAsync, listExportsSync } from "./utils";
import { logger } from "./logging.utils";

export const scanModels = async (modelDir: string) => {
  const imports: {
    name: string;
    alias: string;
    path: string;
  }[] = [];

  const modelTree: {
    [key: string]: unknown | { [key: string]: unknown };
  } = {};

  const modelTypes: {
    signature: string;
    typeDef: string;
  }[] = [];

  async function iterateModels(
    currentDirectory: string,
    tree: any,
    pathStack: string[]
  ) {
    const dirItems = fs.readdirSync(currentDirectory);

    for (const dirItem of dirItems) {
      const subDirPath = path.join(currentDirectory, dirItem);
      const pathStats = fs.statSync(subDirPath);

      if (pathStats.isDirectory()) {
        // FOLDER NAME
        tree[dirItem] = tree[dirItem] || {};
        await iterateModels(subDirPath, tree[dirItem], [...pathStack, dirItem]);
      } else if (dirItem.endsWith(".ts")) {
        // MODEL FILE
        logger.modelScanner("Scanning model file:", subDirPath);

        const raw_model_name = dirItem.replace(".ts", ""); // GET, POST
        const edited_model_name = raw_model_name + "_model";
        const endpointImportPath =
          "./models/" + pathStack.join("/") + "/" + raw_model_name;
        const fileSignature = ["model", ...pathStack, raw_model_name]
          .join("_")
          .replace(/\//g, "")
          .replace(/\./g, "_");

        const actualFilePath =
          "./src/models/" + pathStack.join("/") + "/" + raw_model_name + ".ts";

        // CHECK FILE EXPORTS
        const exports = listExportsSync(actualFilePath);
        for (const exportedVariable of exports) {
          const importAlias = `${fileSignature}_${exportedVariable}`;

          imports.push({
            name: exportedVariable,
            alias: importAlias,
            path: endpointImportPath,
          });

          tree[edited_model_name] = `__CODE_START__${importAlias}__CODE_END__`;

          modelTypes.push({
            signature: importAlias,
            typeDef: importAlias,
          });
        }
      }
    }
  }

  await iterateModels(modelDir, modelTree, []);

  return { imports, modelTree };
};
