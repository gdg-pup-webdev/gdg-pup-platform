import path from "node:path";
import { SourceFile, ModuleDeclarationKind, ModuleDeclaration } from "ts-morph";
import { TsFile } from "./TsFile";
import { tsmUtils } from "#utils/tsm.utils.js";
import { sanitizeToIdentifier } from "#utils/core.utils.js";
import { listTsFilesOfDirectorySync } from "../listTsFilesOfDir";
import { RouteEndpointFile } from "./RouteEndpointFile";
import { logger } from "#utils/logger.utils.js";

export class RouteTree {
  public rootDirAbsolute: string;
  public routesDirRelative: string;
  public routesDirAbsolute: string;

  public children: {
    [key: string]: RouteTree | RouteEndpointFile;
  };

  constructor(rootDirAbsolute: string, routesDirRelative: string) {
    this.children = {};
    this.rootDirAbsolute = rootDirAbsolute;
    this.routesDirRelative = routesDirRelative;
    this.routesDirAbsolute = path.resolve(rootDirAbsolute, routesDirRelative);
  }

  scanDirectory() {
    const routeRootDirAbsolute = path.resolve(
      this.rootDirAbsolute,
      this.routesDirRelative,
    );

    const tsFiles = listTsFilesOfDirectorySync(routeRootDirAbsolute);

    const totalCount = tsFiles.length;
    let count = 0;

    for (const routeFile of tsFiles) {
      count++;
      logger.log(`...${(count * 100 / totalCount).toFixed(2)}%`);
      this.addEndpoint(routeFile);
    }
  }

  addEndpoint(endpoint: TsFile) {
    const newRouteFile = RouteEndpointFile.fromTsFile(
      endpoint,
      this.routesDirAbsolute,
    );

    let currentTree: RouteTree = this;
    for (const segment of newRouteFile.urlSegmentsClean) {
      const cleanSegment = sanitizeToIdentifier(segment);

      if (!currentTree.children[cleanSegment]) {
        currentTree.children[cleanSegment] = new RouteTree(
          this.rootDirAbsolute,
          this.routesDirRelative,
        );
      }

      if (currentTree.children[cleanSegment] instanceof RouteEndpointFile) {
        throw new Error(
          "Cannot add more path beyond an endpoint node. " +
            "\nSegment: " +
            cleanSegment +
            "\nendpoint: " +
            newRouteFile.toString(),
        );
      }

      currentTree = currentTree.children[cleanSegment];
    }

    currentTree.children[newRouteFile.method] = newRouteFile;
  }

  writeTreeOnFile(
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
      if (value instanceof RouteEndpointFile) {
        const { objectExpression, importStatements } = value.getTsObject(
          sourceFileDirAbsolute,
        );
        tsmUtils.writeObjectToModule(objectExpression, myNamespace, key);
        importStatements.map((e) => {
          myNamespace.getSourceFile().addImportDeclaration(e);
        });

        value.writeTypeOnModule(myNamespace, sourceFileDirAbsolute, key);
      }

      if (value instanceof RouteTree) {
        value.writeTreeOnFile(myNamespace, sourceFileDirAbsolute, key);
      }
    }
  }
}
