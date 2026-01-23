import {
  ListExportOfFilesInDirectory,
  scanFilesInDirectory,
} from "#utils/directory.utils.js";
import { scanContractModels } from "#utils/endpointTypes.utils.js";
import { logger } from "#utils/logging.utils.js";
import { scanPlainModels } from "#utils/modelNamespace.util.js";
import { scanModels } from "#utils/models.utils.js";
import { scanRoutes } from "#utils/routes.utils.js";
import fs from "fs";

export async function generate(
  modelsDir: string,
  routesDir: string,
  outputFilePath: string,
) {
  // 1. Get all files for OpenAPI scanning
  const files = await scanFilesInDirectory(routesDir);

  logger.log("Generating API contract...");

  const imports: string[] = [];

  /**
   * SCAN ROUTES
   */
  logger.log("Scanning routes in:", routesDir);
  const { imports: routeImports, route_tree } = await scanRoutes(routesDir);
  imports.push(...routeImports);
  const route_tree_string = JSON.stringify(route_tree, null, 2).replace(
    /"__CODE_START__(.*?)__CODE_END__"/g,
    "$1",
  );
  const contractTypesTree = await scanContractModels(routesDir);

  /**
   * SCAN MODELS
   */
  logger.log("Scanning models in:", modelsDir);
  const { imports: modelImports, modelTree } = await scanModels(modelsDir);
  imports.push(
    ...modelImports.map(
      (i) => `import { ${i.name} as ${i.alias} } from "${i.path}";`,
    ),
  );
  const modelTreeString = JSON.stringify(modelTree, null, 2).replace(
    /"__CODE_START__(.*?)__CODE_END__"/g,
    "$1",
  );
  const modelTypesTree = await scanPlainModels(modelsDir);

  const { listedFiles, imports: listingImports } =
    await ListExportOfFilesInDirectory(routesDir);
  imports.push(...listingImports);
  const listedFilesString = JSON.stringify(listedFiles, null, 2).replace(
    /"__CODE_START__(.*?)__CODE_END__"/g,
    "$1",
  );

  /**
   * GENERATE OPENAPI SPEC [NEW SECTION]
   */
  // logger.log("Generating OpenAPI Spec...");
  // const openApiString = await generateOpenApiSpec(files);
  //   const openApiString = convertOpenApiSpecToString(openApiObject);

  /**
   * GENERATE FILE
   */
  const fileContent = `
// THIS FILE IS AUTO-GENERATED. DO NOT EDIT.
// RUN "pnpm contract-gen -i ./src/routes -o ./src/contract.ts" TO SYNC CHANGES.

import {z} from "zod";

${imports.join("\n")}


export const contract = ${route_tree_string}

${contractTypesTree}

export const models = ${modelTreeString}

${modelTypesTree}
  
export const openapiendpoints = ${listedFilesString}
 

`;

  fs.writeFileSync(outputFilePath, fileContent);
  logger.log("API Contract generated at src/contract.ts");
}
