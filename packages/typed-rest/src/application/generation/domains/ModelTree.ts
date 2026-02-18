import path from "node:path";
import { ModelEndpointFile } from "./ModelEndpointFile";
import { sanitizeToIdentifier } from "#utils/core.utils.js";
import { listTsFilesOfDirectorySync } from "../listTsFilesOfDir";
import { TsRealFile } from "./TsFile";
import {
  TsFile,
  TsImportStatement,
  TsNamespace,
  TsRawValue,
  TsTypeDeclaration,
  TsVariable,
} from "../tsObjectStuff";

export class ModelTree {
  public rootDirAbsolute: string;
  public modelsDirRelative: string;
  public modelsDirAbsolute: string;

  public children: {
    [key: string]: ModelTree | ModelEndpointFile;
  };

  constructor(rootDirAbsolute: string, modelsDirRelative: string) {
    this.children = {};
    this.rootDirAbsolute = rootDirAbsolute;
    this.modelsDirRelative = modelsDirRelative;
    this.modelsDirAbsolute = path.resolve(rootDirAbsolute, modelsDirRelative);
  }

  scanDirectory() {
    const modelRootDirAbsolute = path.resolve(
      this.rootDirAbsolute,
      this.modelsDirRelative,
    );

    const tsFiles = listTsFilesOfDirectorySync(modelRootDirAbsolute);

    // const totalCount = tsFiles.length;
    // let count = 0;

    for (const routeFile of tsFiles) {
      // count++;
      // // logger.log(`...${(count * 100  / totalCount).toFixed(2)}%`);
      this.addEndpoint(routeFile);
    }
  }

  addEndpoint(endpoint: TsRealFile) {
    const newModelFile = ModelEndpointFile.fromTsFile(
      endpoint,
      this.modelsDirAbsolute,
    );

    let currentTree: ModelTree = this;
    for (const segment of newModelFile.urlSegmentsClean) {
      const cleanSegment = sanitizeToIdentifier(segment);

      if (!currentTree.children[cleanSegment]) {
        currentTree.children[cleanSegment] = new ModelTree(
          this.rootDirAbsolute,
          this.modelsDirRelative,
        );
      }

      if (currentTree.children[cleanSegment] instanceof ModelEndpointFile) {
        throw new Error(
          "Cannot add more path beyond an endpoint node. " +
            "\nSegment: " +
            cleanSegment +
            "\nendpoint: " +
            newModelFile.toString(),
        );
      }

      currentTree = currentTree.children[cleanSegment];
    }

    currentTree.children[newModelFile.method] = newModelFile;
  }

  writeTreeOnTsFileObject(tsFile: TsFile, outputDirAbsolute: string) {
    // 1. Create the root namespace "models"
    const rootNamespace = new TsNamespace(true, "models");

    // 2. Recursively fill the namespace
    this.recursivelyPopulateNamespace(rootNamespace, tsFile, outputDirAbsolute);

    // 3. Add to file
    tsFile.addStatement(rootNamespace);
  }

  private recursivelyPopulateNamespace(
    currentNamespace: TsNamespace,
    tsFile: TsFile,
    outputDirAbsolute: string,
  ) {
    for (const [key, value] of Object.entries(this.children)) {
      // CASE 1: It is a File (Leaf Node)
      if (value instanceof ModelEndpointFile) {
        // Create a namespace for the file (e.g. "transaction")
        const fileNamespace = new TsNamespace(true, key);

        this.addModelFileToNamespace(
          value,
          fileNamespace,
          tsFile,
          outputDirAbsolute,
        );

        currentNamespace.children.push(fileNamespace);
      }

      // CASE 2: It is a Folder (Branch Node)
      else if (value instanceof ModelTree) {
        // Create a namespace for the folder (e.g. "economySystem")
        const folderNamespace = new TsNamespace(true, key);

        // Recurse
        value.recursivelyPopulateNamespace(
          folderNamespace,
          tsFile,
          outputDirAbsolute,
        );

        currentNamespace.children.push(folderNamespace);
      }
    }
  }

  private addModelFileToNamespace(
    modelFile: ModelEndpointFile,
    fileNamespace: TsNamespace,
    tsFile: TsFile,
    outputDirAbsolute: string,
  ) {
    // Iterate over every exported Zod schema in the file
    modelFile.exports.forEach((exportName) => {
      // 1. Generate Import Statement
      // This calculates the relative path from OutputDir -> ModelFile
      const impStruct = modelFile.getImportStatementOfExport(
        exportName,
        outputDirAbsolute,
      );

      if (impStruct.moduleSpecifier && impStruct.namedImports) {
        const namedImports = Array.isArray(impStruct.namedImports)
          ? impStruct.namedImports
          : [impStruct.namedImports];

        namedImports.forEach((namedImp: any) => {
          const name = typeof namedImp === "string" ? namedImp : namedImp.name;
          const alias =
            typeof namedImp === "string"
              ? namedImp
              : namedImp.alias || namedImp.name;

          // Deduplicate imports
          // const exists = tsFile.imports.some(i => i.alias === alias && i.path === impStruct.moduleSpecifier);
          // if (!exists) {
          tsFile.addImport(
            new TsImportStatement(
              name,
              alias,
              false,
              impStruct.moduleSpecifier,
            ),
          );
          // }
        });
      }

      // 2. Generate Exported Variable
      // export const row = economySystem_transaction_row_...;
      const uniqueVarName = modelFile.getExportVariableName(exportName);

      fileNamespace.children.push(
        new TsVariable(true, exportName, new TsRawValue(uniqueVarName)),
      );

      // 3. Generate Exported Type
      // export type row = z.infer<typeof economySystem_transaction_row_...>;
      fileNamespace.children.push(
        new TsTypeDeclaration(
          true,
          exportName,
          `z.infer<typeof ${uniqueVarName}>`,
        ),
      );
    });
  }
}
