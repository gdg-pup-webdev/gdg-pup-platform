import { sanitizeToIdentifier } from "#utils/core.utils.js";
import { listExportsSync } from "#utils/filesystem/listExportsSync.js";
import path from "node:path"; 
import { ImportDeclarationStructure, OptionalKind } from "ts-morph";
 

/**
 * Metadata for a file in a directory
 */

export interface TsFileMetadata {
  absolutePath: string;
  absoluteDirectory: string;
  relativeDirectory: string; // e.g., "users/profile/"
  relativePath: string;
  baseName: string; // e.g., "get.ts"
  fileName: string; // e.g., "get"
  extension: string; // e.g., ".ts"
  exports: string[];
}

export class TsRealFile {
  public readonly id: string;
  public readonly pathAbsolute: string; // path to file in OS
  public readonly dirAbsolute: string; // dir of file in OS

  public readonly rootDirAbsolute: string; // root dir where file lives

  public readonly dirRelative: string; // dir of file relative to root
  public readonly pathRelative: string; // path of file relative to root

  public readonly baseName: string; // name of file without extension
  public readonly fileName: string; // name of file without extension
  public readonly extension: string; // name of file without extension

  public readonly exports: string[];

  constructor(
    rootDirAbsolute: string, // root dir where file lives
    dirRelative: string, // dir of file relative to root
    baseName: string, // full filename including extension
  ) {
    this.id = crypto.randomUUID();

    this.pathAbsolute = path
      .resolve(rootDirAbsolute, dirRelative, baseName)
      .replace(/\\/g, "/");
    this.dirAbsolute = path
      .resolve(rootDirAbsolute, dirRelative)
      .replace(/\\/g, "/");
    this.rootDirAbsolute = rootDirAbsolute.replace(/\\/g, "/");
    this.dirRelative = dirRelative.replace(/\\/g, "/");
    this.pathRelative = path.join(dirRelative, baseName).replace(/\\/g, "/");
    this.baseName = baseName;
    this.fileName = baseName.replace(".ts", "");
    this.extension = baseName.replace(this.fileName, "");
    this.exports = listExportsSync(this.pathAbsolute);
  }

  public toString(): string {
    return JSON.stringify(
      {
        id: this.id,
        pathAbsolute: this.pathAbsolute,
        dirAbsolute: this.dirAbsolute,
        rootDirAbsolute: this.rootDirAbsolute,
        dirRelative: this.dirRelative,
        pathRelative: this.pathRelative,
        baseName: this.baseName,
        fileName: this.fileName,
        extension: this.extension,
        exports: this.exports,
      },
      null,
      2,
    );
  }

  getExportVariableName(exportKey: string) {
    return sanitizeToIdentifier(
      `${this.dirRelative}_${this.fileName}_${exportKey}_${this.id}`,
    );
  }

  getImportStatementOfExport(
    exportKey: string,
    importFromDirAbsolute: string,
  ): OptionalKind<ImportDeclarationStructure> {
    if (!this.exports.includes(exportKey)) {
      throw new Error(
        `Export "${exportKey}" not found in ${this.pathAbsolute}. ` +
          `\nExports Available: ${this.exports.join(", ")}`,
      );
    }

    const dirRelative = path.relative(importFromDirAbsolute, this.dirAbsolute);


    const { dir, name } = path.parse(dirRelative);
    let importPath = path.join(dir, name, this.fileName);
    if (!importPath.startsWith("..") && !importPath.startsWith(".")) {
      importPath = `.${path.sep}${importPath}`;
    }
    const finalPath = importPath.replace(/\\/g, "/");

    const importAlias = this.getExportVariableName(exportKey);

    return {
      moduleSpecifier: finalPath,
      namedImports: [{ name: exportKey, alias: importAlias }],
    };
  }
 
  
}


