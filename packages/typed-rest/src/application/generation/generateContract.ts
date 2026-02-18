import fs from "fs";
import path from "path";
import prettier from "prettier"; 
import { RouteTree } from "./domains/RouteTree";
import { ModelTree } from "./domains/ModelTree";
import { writeOpenApiGenerator } from "./writeOpenApiGenerator";
import { logger } from "#utils/logger.utils.js";
import { TsFile, TsImportStatement } from "./tsObjectStuff";
import { configs } from "#configs/configs.js";

export async function generateContract(
  absoluteRootDir: string,
  relativeModelsDir: string,
  relativeRoutesDir: string,
  relativeOutputDir: string,
  relativeOutputBasename: string,
) {
  const outputDir = path.resolve(absoluteRootDir, relativeOutputDir);
  const outputPath = path.resolve(
    absoluteRootDir,
    relativeOutputDir,
    relativeOutputBasename,
  );

  const mytsfile = new TsFile();

  /**
   * top level imports
   */
  mytsfile.addImport(
    new TsImportStatement("cz", "z", false, `${configs.packageName}/shared`),
  );

  /**
   * scanning files and generating structures
   */
  logger.log("Scanning for routes");
  const routeTree = new RouteTree(absoluteRootDir, relativeRoutesDir);
  routeTree.scanDirectory();
  logger.log("Writing routes");
  routeTree.writeTreeOnTsFileObject(mytsfile, outputDir);

  logger.log("Scanning for models");
  const modelTree = new ModelTree(absoluteRootDir, relativeModelsDir);
  modelTree.scanDirectory();
  logger.log("Writing models");
  modelTree.writeTreeOnTsFileObject(mytsfile, outputDir);

  logger.log("Writing OpenAPI Generator");
  writeOpenApiGenerator(
    mytsfile,
    absoluteRootDir,
    relativeRoutesDir,
    outputDir,
  );

  /**
   * writing
   */
  logger.log("Generating output string");
  const filestring = mytsfile.getString();
  logger.log("Formatting output string");
  const formattedText = await prettier.format(filestring, {
    parser: "typescript",
    printWidth: 80,
  });

  logger.log("Writing output file");
  fs.writeFileSync(outputPath, formattedText);
}
