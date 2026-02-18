import { SourceFile, ts, VariableDeclarationKind } from "ts-morph";

import path from "node:path";
import { listTsFilesOfDirectorySync } from "./listTsFilesOfDir";
import { RouteEndpointFile } from "./domains/RouteEndpointFile";
import { configs } from "#configs/configs.js";

export function writeOpenApiGenerator(
  sourceFile: SourceFile,
  projectRootDirAbsolute: string,
  routeRootDirRelative: string,
) {
  const routeRootDirAbsolute = path.resolve(
    projectRootDirAbsolute,
    routeRootDirRelative,
  );

  const tsFiles = listTsFilesOfDirectorySync(routeRootDirAbsolute);
  const routeFiles = tsFiles.map((f) =>
    RouteEndpointFile.fromTsFile(f, routeRootDirAbsolute),
  );

  // 1. Create the actual data structure in memory
  const data = routeFiles.map((routeFile) => {
    let obj: any = {
      method: routeFile.method,
      path: routeFile.urlPath,
    };

    routeFile.exports.map((e) => {
      obj[e] =
        `__CODE_START__${routeFile.getExportVariableName(e)}__CODE_END__`;

      sourceFile.addImportDeclaration(
        routeFile.getImportStatementOfExport(e, projectRootDirAbsolute),
      );
    });

    return obj;
  });

  // 2. Use JSON.stringify as the initializer
  sourceFile.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    isExported: true,
    declarations: [
      {
        name: "openapiendpoints",
        // null, 2 adds indentation to the generated code
        initializer: JSON.stringify(data, null, 2).replace(
          /"__CODE_START__(.*?)__CODE_END__"/g,
          "$1",
        ),
      },
    ],
  });

  sourceFile.addImportDeclaration({
    moduleSpecifier: `${configs.packageName}/contracts`,
    namedImports: [{ name: "generateOpenApiOptions" }],
  });
  sourceFile.addImportDeclaration({
    moduleSpecifier: `${configs.packageName}/shared`,
    namedImports: [{ name: "cz", alias: "z" }],
  });
  sourceFile.insertText(sourceFile.getEnd(), callGenerateOpenApiOptionsString);
}
const callGenerateOpenApiOptionsString = `
export const generateOpenApiSpec = (
  props: {
    info?: { title: string; version: string; description?: string };
    servers?: { url: string; description?: string }[];
    security?: Record<string, string[]>[];
    generateExample?: boolean;
    openapiendpoints?: any[];
  } = {
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "Generated Documentation",
    },
    servers: [
      { url: "http://localhost:8000", description: "Development server" },
    ],
    security: [{ bearerAuth: [] }],
    generateExample: true,
    openapiendpoints: openapiendpoints,
  },
) => {
  return generateOpenApiOptions(props);
};
`;
