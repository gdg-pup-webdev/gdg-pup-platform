import fs from "fs";
import path from "path";
import prettier from "prettier";
import { Project, ts } from "ts-morph";
import { RouteTree } from "./domains/RouteTree";
import { ModelTree } from "./domains/ModelTree";
import { writeOpenApiGenerator } from "./writeOpenApiGenerator";
import { logger } from "#utils/logger.utils.js";

export async function generateContract(
  absoluteRootDir: string,
  relativeModelsDir: string,
  relativeRoutesDir: string,
  relativeOutputDir: string,
  relativeOutputBasename: string,
) {
  const outputPath = path.resolve(
    absoluteRootDir,
    relativeOutputDir,
    relativeOutputBasename,
  );

  const project = new Project();
  const f = ts.factory;
  const sourceFile = project.createSourceFile(outputPath, "", {
    overwrite: true,
  });

  logger.log("Scanning for routes");
  const routeTree = new RouteTree(absoluteRootDir, relativeRoutesDir);
  routeTree.scanDirectory();
  logger.log("Writing routes");
  routeTree.writeTreeOnFile(sourceFile, absoluteRootDir, "contract");

  logger.log("Scanning for models");
  const modelTree = new ModelTree(absoluteRootDir, relativeModelsDir);
  modelTree.scanDirectory();
  logger.log("Writing models");
  modelTree.writeAsNamespaceOnSourceFile(sourceFile, absoluteRootDir, "models");

  logger.log("Writing OpenAPI Generator");
  writeOpenApiGenerator(sourceFile, absoluteRootDir, relativeRoutesDir);

  // sourceFile.formatText({
  //   indentSize: 2,
  //   newLineKind: ts.NewLineKind.LineFeed,
  //   convertTabsToSpaces: true,
  // });
  // sourceFile.saveSync();
  logger.log("Organizing imports");
  sourceFile.organizeImports();

  logger.log("Formatting");
  const rawText = sourceFile.getFullText();
  const formattedText = await prettier.format(rawText, {
    parser: "typescript",
    singleQuote: true,
    trailingComma: "all",
    printWidth: 100,
  });

  logger.log("Writing");
  fs.writeFileSync(outputPath, formattedText);
}
