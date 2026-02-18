import path from "node:path";
import {
  SourceFile,
  ModuleDeclarationKind,
  ModuleDeclaration,
} from "ts-morph";
import { ModelEndpointFile } from "./ModelEndpointFile"; 
import {
  sanitizeToIdentifier, 
} from "#utils/core.utils.js";  
import { listTsFilesOfDirectorySync } from "../listTsFilesOfDir";
import { TsFile } from "./TsFile";

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

    for (const routeFile of tsFiles) {
      this.addEndpoint(routeFile);
    }
  }

  addEndpoint(endpoint: TsFile) {
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

  writeAsNamespaceOnSourceFile(
    sourceFile: SourceFile | ModuleDeclaration,
    sourceFileDirAbsolute: string,
    namespaceName: string,
  ) {
    const myNamespace = sourceFile.addModule({
      name: namespaceName,
      isExported: true,
      declarationKind: ModuleDeclarationKind.Namespace,
    });

    for (const [key, value] of Object.entries(this.children)) {
      value.writeAsNamespaceOnSourceFile(
        myNamespace,
        sourceFileDirAbsolute,
        key,
      );
    }
  }
}
