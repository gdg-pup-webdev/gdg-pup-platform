import path from "node:path";
import { SourceFile, ModuleDeclarationKind, ModuleDeclaration } from "ts-morph";
import { TsRealFile } from "./TsFile";
import { tsmUtils } from "#utils/tsm.utils.js";
import {
  sanitizeToIdentifier,
  segmentIsPathParameter,
} from "#utils/core.utils.js";
import { listTsFilesOfDirectorySync } from "../listTsFilesOfDir";
import { RouteEndpointFile } from "./RouteEndpointFile";

import {
  TsNamespace,
  TsImportStatement,
  TsObjectLiteral,
  TsRawValue,
  TsVariable,
  TsTypeDeclaration,
  TsFile,
} from "../tsObjectStuff";
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

    // const totalCount = tsFiles.length;
    // let count = 0;

    for (const routeFile of tsFiles) {
      // count++;
      // logger.log(`...${((count * 100) / totalCount).toFixed(2)}%`);
      this.addEndpoint(routeFile);
    }
  }

  addEndpoint(endpoint: TsRealFile) {
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

  // ... inside RouteTree class ...

  writeTreeOnTsFileObject(tsFile: TsFile, outputDirAbsolute: string) {
    // 1. Create the root namespace "contract"
    const rootNamespace = new TsNamespace(true, "contract");

    // 2. Recursively fill the namespace with routes and types
    // Pass the outputDirAbsolute down the chain
    this.recursivelyPopulateNamespace(rootNamespace, tsFile, outputDirAbsolute);

    // 3. Add the populated namespace to the file
    tsFile.addStatement(rootNamespace);
  }

  private recursivelyPopulateNamespace(
    currentNamespace: TsNamespace,
    tsFile: TsFile,
    outputDirAbsolute: string, // <--- Changed from currentDirAbsolute to outputDirAbsolute
  ) {
    for (const [key, value] of Object.entries(this.children)) {
      if (value instanceof RouteEndpointFile) {
        // Pass outputDirAbsolute here
        this.addEndpointToNamespace(
          value,
          currentNamespace,
          tsFile,
          key,
          outputDirAbsolute,
        );
      }

      if (value instanceof RouteTree) {
        const childNamespace = new TsNamespace(true, key);
        // Pass outputDirAbsolute down recursively
        value.recursivelyPopulateNamespace(
          childNamespace,
          tsFile,
          outputDirAbsolute,
        );
        currentNamespace.children.push(childNamespace);
      }
    }
  }

  private addEndpointToNamespace(
    endpoint: RouteEndpointFile,
    parentNamespace: TsNamespace,
    tsFile: TsFile,
    exportName: string,
    outputDirAbsolute: string, // <--- New parameter
  ) {
    // =========================================================
    // 1. HANDLE IMPORTS
    // =========================================================

    // Use the OUTPUT DIR as the base for relative imports
    const { importStatements } = endpoint.getTsObject(outputDirAbsolute);

    importStatements.forEach((impStr) => {
      if (impStr.moduleSpecifier && impStr.namedImports) {
        const namedImports = Array.isArray(impStr.namedImports)
          ? impStr.namedImports
          : [impStr.namedImports];

        namedImports.forEach((namedImp: any) => {
          const name = typeof namedImp === "string" ? namedImp : namedImp.name;
          const alias =
            typeof namedImp === "string"
              ? namedImp
              : namedImp.alias || namedImp.name;

          // Deduplicate imports
          // const exists = tsFile.imports.some(
          //   (i) => i.alias === alias && i.path === impStr.moduleSpecifier,
          // );
          // if (!exists) {
          tsFile.addImport(
            new TsImportStatement(name, alias, false, impStr.moduleSpecifier),
          );
          // }
        });
      }
    });

    // =========================================================
    // 2. BUILD THE ROUTE OBJECT (export const GET = { ... })
    // =========================================================

    // 2a. Build Request Object Literal (nested)
    const requestLiteral = new TsObjectLiteral();
    const pathParams = endpoint.urlSegments
      .filter(segmentIsPathParameter)
      .map((p) => p.slice(1, -1));

    if (pathParams.length > 0) {
      const zodString = `z.object({${pathParams.map((p) => `${p}: z.string()`).join(",")}})`;
      requestLiteral.addProperty("params", new TsRawValue(zodString));
    }

    ["files", "body", "query"].forEach((prop) => {
      if (endpoint.exports.includes(prop)) {
        requestLiteral.addProperty(
          prop,
          new TsRawValue(endpoint.getExportVariableName(prop)),
        );
      }
    });

    // 2b. Build Main Object Literal
    const routeObject = new TsObjectLiteral({
      method: new TsRawValue(`'${endpoint.method}'`), // wrap in quotes
      path: new TsRawValue(`'${endpoint.urlPath}'`), // wrap in quotes
    });

    if (endpoint.exports.includes("response")) {
      routeObject.addProperty(
        "response",
        new TsRawValue(endpoint.getExportVariableName("response")),
      );
    }

    // Only add request block if it has properties
    // if (Object.keys(requestLiteral.properties).length > 0) {
    //   routeObject.addProperty("request", requestLiteral);
    // }
    routeObject.addProperty("request", requestLiteral);

    // 2c. Add Variable to Namespace
    parentNamespace.children.push(
      new TsVariable(true, exportName, routeObject),
    );

    // =========================================================
    // 3. BUILD THE TYPE NAMESPACE (export namespace GET { ... })
    // =========================================================
    const typeNamespace = new TsNamespace(true, exportName);
    const requestTypeNamespace = new TsNamespace(true, "request");

    // 3a. Params Type
    if (pathParams.length > 0) {
      const zodString = `z.ZodObject<{${pathParams.map((p) => `${p}: z.ZodString`).join(", ")}}>`;
      requestTypeNamespace.children.push(
        new TsTypeDeclaration(true, "params", `z.infer<${zodString}>`),
      );
    }

    // 3b. Files, Body, Query Types
    ["files", "body", "query"].forEach((prop) => {
      if (endpoint.exports.includes(prop)) {
        requestTypeNamespace.children.push(
          new TsTypeDeclaration(
            true,
            prop,
            `z.infer<typeof ${endpoint.getExportVariableName(prop)}>`,
          ),
        );
      }
    });

    // Add nested 'request' namespace if it has children
    // if (requestTypeNamespace.children.length > 0) {
    typeNamespace.children.push(requestTypeNamespace);
    // }

    // 3c. Metadata Types
    typeNamespace.children.push(
      new TsTypeDeclaration(true, "method", `'${endpoint.method}'`),
    );
    typeNamespace.children.push(
      new TsTypeDeclaration(true, "path", `'${endpoint.urlPath}'`),
    );

    // 3d. Response Type
    if (endpoint.exports.includes("response")) {
      const respVar = endpoint.getExportVariableName("response");
      const mappedType = `{ [K in keyof typeof ${respVar}]: z.infer<(typeof ${respVar})[K]> }`;
      typeNamespace.children.push(
        new TsTypeDeclaration(true, "response", mappedType),
      );
    }

    // Add Type Namespace to Parent
    parentNamespace.children.push(typeNamespace);
  }
}
