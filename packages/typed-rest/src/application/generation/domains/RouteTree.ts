import path from "node:path";
import { SourceFile, ModuleDeclarationKind, ModuleDeclaration } from "ts-morph";
import { TsFile } from "./TsFile";
import { tsmUtils } from "#utils/tsm.utils.js";
import { sanitizeToIdentifier } from "#utils/core.utils.js";
import { listTsFilesOfDirectorySync } from "../listTsFilesOfDir";
import { RouteEndpointFile } from "./RouteEndpointFile";
import { logger } from "#utils/logger.utils.js";
import fs from "fs";

import {
  OptionalKind,
  ImportDeclarationStructure,
  ts,
  ModuleDeclarationStructure,
  StructureKind,
} from "ts-morph";
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
      logger.log(`...${((count * 100) / totalCount).toFixed(2)}%`);
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

  writeToSourceFile(sourceFile: SourceFile) {
    const collectedImports: OptionalKind<ImportDeclarationStructure>[] = [];

    // 1. Generate the tree structure in memory
    const rootNamespaceStructure = this.generateStructure(
      this.routesDirAbsolute,
      "AppRoutes", // or whatever your root namespace is
      collectedImports,
    );

    // 2. Add all imports at once (FAST)
    // Deduplicate imports if necessary here
    sourceFile.addImportDeclarations(collectedImports);

    // 3. Add the entire module tree at once (FAST)
    if (rootNamespaceStructure) {
      sourceFile.addModule(rootNamespaceStructure);
    }
  }

  /**
   * Recursive function that returns a STRUCTURE instead of writing
   */
  private generateStructure(
    sourceFileDirAbsolute: string,
    namespaceName: string,
    collectedImports: OptionalKind<ImportDeclarationStructure>[],
  ): OptionalKind<ModuleDeclarationStructure> {
    // Create the structure for the current namespace
    const moduleStructure: OptionalKind<ModuleDeclarationStructure> = {
      name: namespaceName,
      isExported: true,
      declarationKind: ModuleDeclarationKind.Namespace,
      statements: [], // We will fill this array
    };

    for (const [key, value] of Object.entries(this.children)) {
      if (value instanceof RouteEndpointFile) {
        // 1. Get the object expression string/structure
        const { objectExpression, importStatements } = value.getTsObject(
          sourceFileDirAbsolute,
        );

        // Collect imports (don't write them yet)
        collectedImports.push(...importStatements);

        // Add the object export to statements
        // Assuming tsmUtils can return a string or you convert the node to string
        // Using a writer function is best here:
        (moduleStructure.statements as any[]).push((writer: any) => {
          writer.write(`export const ${key} = `);
          // You might need a printer to convert the TS Node to string if objectExpression is a Node
          // Or update getTsObject to return a string/writer
          writer.write(tsmUtils.printNode_old(objectExpression));
        });

        // 2. Get the Type definitions structure
        const typeStructures = value.getTypeStructures(
          sourceFileDirAbsolute,
          key,
          collectedImports,
        );
        (moduleStructure.statements as any[]).push(typeStructures);
      }

      if (value instanceof RouteTree) {
        // Recursively get the structure
        const childStruct = value.generateStructure(
          sourceFileDirAbsolute,
          key,
          collectedImports,
        );
        (moduleStructure.statements as any[]).push(childStruct);
      }
    }

    return moduleStructure;
  }

  writeToDiskFast(outputPath: string) {
    const imports = new Set<string>();

    // 1. Generate the body content (recursively)
    const bodyContent = this.generateBodyString(
      this.routesDirAbsolute,
      imports,
    );

    // 2. Combine Imports + Body
    const fileContent = [
      ...Array.from(imports),
      "",
      `export namespace contract {`, // Root namespace
      bodyContent,
      `}`,
    ].join("\n");

    // 3. Write purely using FS (Bypasses ts-morph entirely)
    fs.writeFileSync(outputPath, fileContent);
  }

  private generateBodyString(
    sourceFileDirAbsolute: string,
    imports: Set<string>,
  ): string {
    const parts: string[] = [];

    for (const [key, value] of Object.entries(this.children)) {
      if (value instanceof RouteEndpointFile) {
        // Open Module
        parts.push(`export namespace ${key} {`);

        // 1. Add the const export
        parts.push(value.getExportString(sourceFileDirAbsolute, key, imports));

        // 2. Add the type exports
        parts.push(value.getTypeString(sourceFileDirAbsolute, imports));

        // Close Module
        parts.push(`}`);
      }

      if (value instanceof RouteTree) {
        // Open Namespace
        parts.push(`export namespace ${key} {`);

        // Recurse
        parts.push(value.generateBodyString(sourceFileDirAbsolute, imports));

        // Close Namespace
        parts.push(`}`);
      }
    }

    return parts.join("\n");
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
