import { sanitizeToIdentifier } from "#utils/core.utils.js";
import { TsRealFile } from "./TsFile";

export class ModelEndpointFile extends TsRealFile {
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

  static fromTsFile(tsFile: TsRealFile, routeRootDirAbsolute: string) {
    return new ModelEndpointFile(
      routeRootDirAbsolute,
      tsFile.dirRelative,
      tsFile.baseName,
    );
  }
}
