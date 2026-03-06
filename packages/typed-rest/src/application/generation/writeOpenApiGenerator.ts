import path from "node:path";
import { listTsFilesOfDirectorySync } from "./listTsFilesOfDir";
import { RouteEndpointFile } from "./domains/RouteEndpointFile";
import { configs } from "#configs/configs.js";
import {
  TsFile,
  TsObjectLiteral,
  TsRawValue,
  TsImportStatement,
  TsVariable,
  TsArrayLiteral,
} from "./tsObjectStuff";

export function writeOpenApiGenerator(
  tsFile: TsFile,
  projectRootDirAbsolute: string,
  routeRootDirRelative: string,
  outputDirAbsolute: string,
) {
  const routeRootDirAbsolute = path.resolve(
    projectRootDirAbsolute,
    routeRootDirRelative,
  );

  const tsFiles = listTsFilesOfDirectorySync(routeRootDirAbsolute, [
    "**/(__deprecated__)", // Matches the folder (v0) anywhere
    "**/(__deprecated__)/**", // Matches anything inside (v0) anywhere
  ]);
  const routeFiles = tsFiles.map((f) =>
    RouteEndpointFile.fromTsFile(f, routeRootDirAbsolute),
  );

  // 1. Build the array of Route Object Literals
  const routeObjects = routeFiles.map((routeFile) => {
    const obj = new TsObjectLiteral({
      method: new TsRawValue(`'${routeFile.method}'`.toLocaleLowerCase()),
      path: new TsRawValue(
        `'${routeFile.urlPath}'`.replace(/\[/g, "{").replace(/\]/g, "}"),
      ),
    });

    routeFile.exports.forEach((e) => {
      const varName = routeFile.getExportVariableName(e);
      obj.addProperty(e, new TsRawValue(varName));

      // Add the import to the file
      const imp = routeFile.getImportStatementOfExport(e, outputDirAbsolute);
      tsFile.addImport(
        new TsImportStatement(e, varName, false, imp.moduleSpecifier as string),
      );
    });

    return obj;
  });

  // 2. Add the variable: export const openapiendpoints = [...]
  tsFile.addStatement(
    new TsVariable(true, "openapiendpoints", new TsArrayLiteral(routeObjects)),
  );

  // 3. Add Static Imports
  tsFile.addImport(
    new TsImportStatement(
      "generateOpenApiOptions",
      "generateOpenApiOptionsREAL",
      false,
      `${configs.packageName}/contracts`,
    ),
  );

  // 4. Add the helper function as a raw block
  tsFile.addStatement(new TsRawValue(generateOpenApiOptionsString));
}

export const generateOpenApiOptionsString = `
export const generateOpenApiOptions = ({
  info = { title: "API Documentation", version: "1.0.0", description: "Generated Documentation" },
  servers = [{ url: "http://localhost:8000", description: "Development server" }],
  security = [{ bearerAuth: [] }],
  tags = [],
  generateExample = true,
}: {
  info?: { title: string; version: string; description?: string };
  servers?: { url: string; description?: string }[];
  security?: Record<string, string[]>[];
  tags?: { name: string; description?: string }[];
  generateExample?: boolean;
}) => {
  return  generateOpenApiOptionsREAL({
      info,
      servers,
      security,
      tags,
      generateExample,
      openapiendpoints,
    });
};
`;
