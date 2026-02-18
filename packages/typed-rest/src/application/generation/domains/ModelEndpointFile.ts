import { sanitizeToIdentifier } from "#utils/core.utils.js";

import { 
  ModuleDeclarationKind,
  SourceFile,
  VariableDeclarationKind,
  ModuleDeclaration,
} from "ts-morph"; 
import { TsFile } from "./TsFile";

export class ModelEndpointFile extends TsFile {
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
      return sanitizeToIdentifier(segment);
    });
    this.method = this.fileName;
    this.urlPath = `/${this.urlSegments.join("/")}`;
  }

  static fromTsFile(tsFile: TsFile, routeRootDirAbsolute: string) {
    return new ModelEndpointFile(
      routeRootDirAbsolute,
      tsFile.dirRelative,
      tsFile.baseName,
    );
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

    this.exports.map((e) => {
      myNamespace
        .getSourceFile()
        .addImportDeclaration(
          this.getImportStatementOfExport(e, sourceFileDirAbsolute),
        );

      myNamespace.addVariableStatement({
        declarationKind: VariableDeclarationKind.Const,
        isExported: true,
        declarations: [
          {
            name: e,
            initializer: this.getExportVariableName(e),
          },
        ],
      });

      myNamespace.addTypeAlias({
        name: e,
        isExported: true,
        type: `z.infer<typeof ${this.getExportVariableName(e)}>`,
      });
    });
  }
}
