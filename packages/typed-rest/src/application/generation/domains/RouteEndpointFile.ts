import { TsRealFile } from "./TsFile";
import { segmentIsPathParameter } from "#utils/core.utils.js";
import { ImportDeclarationStructure, OptionalKind } from "ts-morph";

export class RouteEndpointFile extends TsRealFile {
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

    // this.urlSegments = this.dirRelative.split("/").filter(Boolean);
    this.urlSegments = this.dirRelative.split("/").filter((segment) => {
      const isNotEmpty = Boolean(segment);
      const isGroupFolder = segment.startsWith("(") && segment.endsWith(")");
      return isNotEmpty && !isGroupFolder;
    });

    this.urlSegmentsClean = this.urlSegments.map((segment) => {
      return segment.replace(/\[|\]/g, "");
    });
    this.method = this.fileName.toUpperCase();
    this.urlPath = `/${this.urlSegments.join("/")}`;
  }

  static fromTsFile(tsFile: TsRealFile, routeRootDirAbsolute: string) {
    return new RouteEndpointFile(
      routeRootDirAbsolute,
      tsFile.dirRelative,
      tsFile.baseName,
    );
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
   * Get the object expression for the route file
   * encapsulates all file exports into single object
   */
  getTsObject(importFromDirAbsolute: string): {
    importStatements: OptionalKind<ImportDeclarationStructure>[];
  } {
    const importStatements = [];

    if (this.exports.includes("files")) {
      importStatements.push(
        this.getImportStatementOfExport("files", importFromDirAbsolute),
      );
    }

    if (this.exports.includes("body")) {
      importStatements.push(
        this.getImportStatementOfExport("body", importFromDirAbsolute),
      );
    }

    if (this.exports.includes("query")) {
      importStatements.push(
        this.getImportStatementOfExport("query", importFromDirAbsolute),
      );
    }

    if (this.exports.includes("response")) {
      importStatements.push(
        this.getImportStatementOfExport("response", importFromDirAbsolute),
      );
    }

    return {
      importStatements: importStatements,
    };
  }
}
