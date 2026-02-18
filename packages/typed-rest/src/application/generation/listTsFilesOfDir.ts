import path from "node:path"; 
import { promises as fs } from "fs";
import fsSync from "node:fs";
import { TsRealFile } from "./domains/TsFile";

/**
 * Scan a directory for all ts files
 * make a list of objects containing the relative path, filename, and exports
 */
export async function listTsFilesOfDirectory(
  directoryAbsolute: string,
): Promise<TsRealFile[]> {
  /**
   * Scan the directory for .ts files
   */
  const tsFileMap: TsRealFile[] = [];

  async function iterate(currentDir: string, segments: string[]) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const absolutePath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        await iterate(absolutePath, [...segments, entry.name]);
      } else if (entry.isFile() && entry.name.endsWith(".ts")) {
        const relativeDirectory = segments.join("/");

        const baseName = entry.name;

        const tsFile = new TsRealFile(
          directoryAbsolute,
          relativeDirectory,
          baseName,
        );

        tsFileMap.push(tsFile);
      }
    }
  }

  await iterate(directoryAbsolute, []);

  return tsFileMap;
}

export function listTsFilesOfDirectorySync(
  directoryAbsolute: string,
): TsRealFile[] {
  const tsFiles: TsRealFile[] = [];

  function iterate(currentDir: string, segments: string[]) {
    // 1. Use readdirSync with file types
    const entries = fsSync.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const absolutePath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        // 2. Recursive synchronous call
        iterate(absolutePath, [...segments, entry.name]);
      } else if (entry.isFile() && entry.name.endsWith(".ts")) {
        const relativeDirectory = segments.join("/");
        const baseName = entry.name;

        // 3. Instantiate TsFile (ensure the constructor is also sync)
        const tsFile = new TsRealFile(
          directoryAbsolute,
          relativeDirectory,
          baseName,
        );

        tsFiles.push(tsFile);
      }
    }
  }

  iterate(directoryAbsolute, []);

  return tsFiles;
}
