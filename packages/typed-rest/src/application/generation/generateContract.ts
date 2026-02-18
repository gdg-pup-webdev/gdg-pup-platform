import fs from "fs";
import path from "path";
import prettier from "prettier";
import { Project, ts } from "ts-morph"; 
import { RouteTree } from "./domains/RouteTree";
import { ModelTree } from "./domains/ModelTree";
import { writeOpenApiGenerator } from "./writeOpenApiGenerator";

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

  const routeTree = new RouteTree(absoluteRootDir, relativeRoutesDir);
  routeTree.scanDirectory();
  routeTree.writeTreeOnFile(
    sourceFile,
    absoluteRootDir,
    "contract",
  );

  const modelTree = new ModelTree(absoluteRootDir, relativeModelsDir);
  modelTree.scanDirectory();
  modelTree.writeAsNamespaceOnSourceFile(sourceFile, absoluteRootDir, "models");

  writeOpenApiGenerator(sourceFile, absoluteRootDir, relativeRoutesDir);

  // sourceFile.formatText({
  //   indentSize: 2,
  //   newLineKind: ts.NewLineKind.LineFeed,
  //   convertTabsToSpaces: true,
  // });
  // sourceFile.saveSync();
  sourceFile.organizeImports();
  const rawText = sourceFile.getFullText();
  const formattedText = await prettier.format(rawText, {
    parser: "typescript",
    singleQuote: true,
    trailingComma: "all",
    printWidth: 100,
  });
  fs.writeFileSync(outputPath, formattedText);
}
