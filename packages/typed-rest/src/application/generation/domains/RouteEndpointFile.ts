 

import {
  OptionalKind,
  ImportDeclarationStructure,
  ts,
  ModuleDeclarationKind,
  SourceFile, 
  ModuleDeclaration,
} from "ts-morph"; 
import { tsmUtils } from "#utils/tsm.utils.js";
import { TsFile } from "./TsFile";
import { segmentIsPathParameter } from "#utils/core.utils.js";

export class RouteEndpointFile extends TsFile {
  public urlSegments: string[];
  public urlSegmentsClean: string[];
  public method: string;
  public urlPath: string;

  constructor(
    rootDirAbsolute: string, // root dir where file lives
    dirRelative: string, // dir of file relative to root
    baseName: string,
  ) {
    super(rootDirAbsolute, dirRelative, baseName);

    this.urlSegments = this.dirRelative.split("/").filter(Boolean);
    this.urlSegmentsClean = this.urlSegments.map((segment) => {
      return segment.replace(/\[|\]/g, "");
    });
    this.method = this.fileName.toUpperCase();
    this.urlPath = `/${this.urlSegments.join("/")}`;
  }

  static fromTsFile(tsFile: TsFile, routeRootDirAbsolute: string) {
    return new RouteEndpointFile(
      routeRootDirAbsolute,
      tsFile.dirRelative,
      tsFile.baseName,
    );
  }

  /**
   * Get the object expression for the route file
   * encapsulates all file exports into single object
   */
  getTsObject(importFromDirAbsolute: string): {
    objectExpression: ts.ObjectLiteralExpression;
    importStatements: OptionalKind<ImportDeclarationStructure>[];
  } {
    const f = ts.factory;

    const importStatements = [];

    const objectExpressionKeys = [
      f.createPropertyAssignment(
        f.createIdentifier("method"),
        f.createStringLiteral(this.method),
      ),
      f.createPropertyAssignment(
        f.createIdentifier("path"),
        f.createStringLiteral(this.urlPath),
      ),
    ];

    const requestExpressionKeys = [];

    const pathParams = this.urlSegments
      .filter(segmentIsPathParameter)
      .map((p) => p.slice(1, -1));

    if (pathParams.length > 0) {
      requestExpressionKeys.push(
        f.createPropertyAssignment(
          f.createIdentifier("params"),
          tsmUtils.codeStringToExpression(
            `z.object({${pathParams.map((p) => `${p}: z.string()`).join(",")}})`,
          ),
        ),
      );
    }

    if (this.exports.includes("files")) {
      requestExpressionKeys.push(
        f.createPropertyAssignment(
          f.createIdentifier("files"),
          f.createIdentifier(this.getExportVariableName("files")),
        ),
      );

      importStatements.push(
        this.getImportStatementOfExport("files", importFromDirAbsolute),
      );
    }

    if (this.exports.includes("body")) {
      requestExpressionKeys.push(
        f.createPropertyAssignment(
          f.createIdentifier("body"),
          f.createIdentifier(this.getExportVariableName("body")),
        ),
      );

      importStatements.push(
        this.getImportStatementOfExport("body", importFromDirAbsolute),
      );
    }

    if (this.exports.includes("query")) {
      requestExpressionKeys.push(
        f.createPropertyAssignment(
          f.createIdentifier("query"),
          f.createIdentifier(this.getExportVariableName("query")),
        ),
      );

      importStatements.push(
        this.getImportStatementOfExport("query", importFromDirAbsolute),
      );
    }

    if (this.exports.includes("response")) {
      objectExpressionKeys.push(
        f.createPropertyAssignment(
          f.createIdentifier("response"),
          f.createIdentifier(this.getExportVariableName("response")),
        ),
      );

      importStatements.push(
        this.getImportStatementOfExport("response", importFromDirAbsolute),
      );
    }

    // insert request body to object expression keys
    objectExpressionKeys.push(
      f.createPropertyAssignment(
        f.createIdentifier("request"),
        f.createObjectLiteralExpression(requestExpressionKeys, true),
      ),
    );

    return {
      objectExpression: f.createObjectLiteralExpression(
        objectExpressionKeys,
        true,
      ),
      importStatements: importStatements,
    };
  }

  /**
   * wrap all export types into a single namespace
   * and write it to a module
   */
  writeTypeOnModule(
    sourceFile: SourceFile | ModuleDeclaration,
    sourceFileDirAbsolute: string,
    namespaceName: string,
  ) {
    const myNamespace = sourceFile.addModule({
      name: namespaceName,
      isExported: true,
      declarationKind: ModuleDeclarationKind.Namespace,
    });

    const requestNamespace = myNamespace.addModule({
      name: "request",
      isExported: true,
      declarationKind: ModuleDeclarationKind.Namespace,
    })

    myNamespace.addTypeAlias({
      name: "method",
      isExported: true,
      type: `"${this.method}"`,
    });

    myNamespace.addTypeAlias({
      name: "path",
      isExported: true,
      type: `"${this.urlPath}"`,
    });

    /////////////////////////////////////////
    //
    // PATH PARAMS
    //
    /////////////////////////////////////////
    const pathParams = this.urlSegments
      .filter(segmentIsPathParameter)
      .map((p) => p.slice(1, -1));

    if (pathParams.length > 0) {
      requestNamespace.addTypeAlias({
        name: "params",
        isExported: true,
        type: `z.infer< z.ZodObject<{${pathParams.map((p) => `${p}: z.ZodString`).join(", ")}}>>`,
      });
    }

    /////////////////////////////////////////
    //
    // FILES
    //
    /////////////////////////////////////////
    if (this.exports.includes("files")) {
      requestNamespace
        .getSourceFile()
        .addImportDeclaration(
          this.getImportStatementOfExport("files", sourceFileDirAbsolute),
        );

      requestNamespace.addTypeAlias({
        name: "files",
        isExported: true,
        type: `z.infer<typeof ${this.getExportVariableName("files")}>`,
      });
    }

    /////////////////////////////////////////
    //
    // BODY
    //
    /////////////////////////////////////////
    if (this.exports.includes("body")) {
      requestNamespace
        .getSourceFile()
        .addImportDeclaration(
          this.getImportStatementOfExport("body", sourceFileDirAbsolute),
        );

      requestNamespace.addTypeAlias({
        name: "body",
        isExported: true,
        type: `z.infer<typeof ${this.getExportVariableName("body")}>`,
      });
    }

    /////////////////////////////////////////
    //
    // QUERY
    //
    /////////////////////////////////////////
    if (this.exports.includes("query")) {
      requestNamespace
        .getSourceFile()
        .addImportDeclaration(
          this.getImportStatementOfExport("query", sourceFileDirAbsolute),
        );

      requestNamespace.addTypeAlias({
        name: "query",
        isExported: true,
        type: `z.infer<typeof ${this.getExportVariableName("query")}>`,
      });
    }

    if (this.exports.includes("response")) {
      myNamespace
        .getSourceFile()
        .addImportDeclaration(
          this.getImportStatementOfExport("response", sourceFileDirAbsolute),
        );

      myNamespace.addTypeAlias({
        name: "response",
        isExported: true,
        type: `{ [K in keyof typeof ${this.getExportVariableName("response")}]: z.infer<(typeof ${this.getExportVariableName("response")})[K]> }`,
      });
    }
  }
}
