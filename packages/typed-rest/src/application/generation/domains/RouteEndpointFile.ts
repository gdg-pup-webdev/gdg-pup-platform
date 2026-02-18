import {
  OptionalKind,
  ImportDeclarationStructure,
  ts,
  ModuleDeclarationKind,
  SourceFile,
  ModuleDeclaration,
  ModuleDeclarationStructure,
  StructureKind,
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

  getTypeStructures(
    sourceFileDirAbsolute: string,
    namespaceName: string,
    importsCollector: any[],
  ): ModuleDeclarationStructure {
    // Collect imports
    if (this.exports.includes("files")) {
      importsCollector.push(
        this.getImportStatementOfExport("files", sourceFileDirAbsolute),
      );
    }
    // ... repeat for body, query, response ...

    // Create the namespace structure
    const myNamespace: ModuleDeclarationStructure = {
      kind: StructureKind.Module, // <--- 1. REQUIRED: Identify this as a Module
      name: namespaceName,
      isExported: true,
      declarationKind: ModuleDeclarationKind.Namespace,
      statements: [
        {
          kind: StructureKind.Module, // <--- 2. REQUIRED: Identify nested object as Module
          name: "request",
          isExported: true,
          declarationKind: ModuleDeclarationKind.Namespace,
          statements: [
            // params type alias...
          ],
        },
        {
          kind: StructureKind.TypeAlias, // <--- Already correct here
          name: "method",
          type: `"${this.method}"`,
          isExported: true,
        },
        {
          kind: StructureKind.TypeAlias, // <--- Already correct here
          name: "path",
          type: `"${this.urlPath}"`,
          isExported: true,
        },
      ],
    };

    return myNamespace;
  }

  getExportString(
    sourceFileDirAbsolute: string,
    exportName: string,
    imports: Set<string>,
  ): string {
    const { objectExpression, importStatements } = this.getTsObject(
      sourceFileDirAbsolute,
    );

    // 1. Collect imports strings into the Set
    importStatements.forEach((imp) => {
      // Assuming your getImportStatementOfExport returns a Structure.
      // We reconstruct the string simply here for speed.
      // Or if you can get the raw string from your utils, do that.
      // Example format: import { X } from "./path";
      if (imp.moduleSpecifier && imp.namedImports) {
        const names = (imp.namedImports as any[])
          .map((n) => (typeof n === "string" ? n : n.name))
          .join(", ");
        imports.add(`import { ${names} } from "${imp.moduleSpecifier}";`);
      }
    });

    // 2. Convert the object expression to string immediately
    const objectString = tsmUtils.printNode(objectExpression);
    return `export const ${exportName} = ${objectString};`;
  }

  /**
   * Returns the "export namespace request { ... }" string
   */
  getTypeString(sourceFileDirAbsolute: string, imports: Set<string>): string {
    // Collect imports exactly like above...
    // (You can refactor import collection to a helper method)

    const parts: string[] = [];

    // Start Namespace
    parts.push(`export namespace request {`);

    // Params
    const pathParams = this.urlSegments
      .filter(segmentIsPathParameter)
      .map((p) => p.slice(1, -1));

    if (pathParams.length > 0) {
      const zodObject = `z.object({${pathParams.map((p) => `${p}: z.string()`).join(", ")}})`;
      // Note: We use z.infer<typeof ZodObject> pattern or just raw TS types if you prefer
      parts.push(`  export type params = z.infer<${zodObject}>;`);
    }

    // Files
    if (this.exports.includes("files")) {
      parts.push(
        `  export type files = z.infer<typeof ${this.getExportVariableName("files")}>;`,
      );
    }

    // Body
    if (this.exports.includes("body")) {
      parts.push(
        `  export type body = z.infer<typeof ${this.getExportVariableName("body")}>;`,
      );
    }

    // Query
    if (this.exports.includes("query")) {
      parts.push(
        `  export type query = z.infer<typeof ${this.getExportVariableName("query")}>;`,
      );
    }

    parts.push(`}`); // End request namespace

    // Metadata types
    parts.push(`export type method = "${this.method}";`);
    parts.push(`export type path = "${this.urlPath}";`);

    // Response
    if (this.exports.includes("response")) {
      const respVar = this.getExportVariableName("response");
      parts.push(
        `export type response = { [K in keyof typeof ${respVar}]: z.infer<(typeof ${respVar})[K]> };`,
      );
    }

    return parts.join("\n");
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
    });

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
