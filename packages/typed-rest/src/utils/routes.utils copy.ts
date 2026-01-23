 
import fs from "fs";
import path from "path"; 
import { listExportsSync, segmentIsPathParameter } from "./utils.js";



export const scanRoutes =async (routesDir: string) => {
    const imports: string[] = [];
  let route_tree: any = {};

  async function iterateDirectory(
    currentDirectory: string,
    route_tree: any,
    pathStack: string[],
  ) {
    // Read all files and folders in the current directory
    const dirItems = fs.readdirSync(currentDirectory);

    for (const dirItem of dirItems) {
      const fullPath = path.join(currentDirectory, dirItem);
      const pathStats = fs.statSync(fullPath);

      if (pathStats.isDirectory()) {
        // FOLDER NAME

        const route_key = dirItem.replace(/\[|\]/g, "").replace(/-/g, "_");

        route_tree[route_key] = route_tree[route_key] || {};

        await iterateDirectory(fullPath, route_tree[route_key], [
          ...pathStack,
          dirItem,
        ]);
      } else if (dirItem.endsWith(".ts")) {
        // logger.routeScanner("Scanning route file:", fullPath);

        // METADATA STUFF
        const endpointMethod = dirItem.replace(".ts", ""); // GET, POST
        const endpointRoute = "/" + pathStack.join("/"); // e.g., /users/[userId]/
        const endpointImportPath =
          "./routes/" + pathStack.join("/") + "/" + endpointMethod;

        const actualFilePath =
          "./src/routes/" + pathStack.join("/") + "/" + endpointMethod + ".ts";

        // FILE NAME
        const endpoint_signature = [...pathStack, endpointMethod]
          .join("_")
          .replace(/\[|\]/g, "")
          .replace(/\./g, "_")
          .replace(/-/g, "_");

        // code wrapped in __CODE_START__ and __CODE_END__ to preserve variable names during JSON serialization
        let request: any = {};
        let response: any = {};
        let metadata: any = {
          method: endpointMethod,
          path: endpointRoute,
          signature: endpoint_signature,
        };

        // PROCESS REQUEST STUFF
        const pathParams = pathStack
          .filter(segmentIsPathParameter)
          .map((p) => p.slice(1, -1));
        if (pathParams.length > 0) {
          request["params"] =
            `__CODE_START__z.object({${pathParams.map((p) => `${p}: z.string()`).join(",")}})__CODE_END__`;
        }

        // CHECK FILE EXPORTS
        const exports = listExportsSync(actualFilePath);
        for (const exportedVariable of exports) {
          if (exportedVariable === "response") {
            const schemaImportName = `${endpoint_signature}_response`;

            imports.push(
              `import { ${exportedVariable} as ${schemaImportName} } from "${endpointImportPath}";`,
            );

            response = `__CODE_START__${schemaImportName}__CODE_END__`;
            // responseRaw = schemaImportName;
          } else {
            const schemaImportName = `${endpoint_signature}_${exportedVariable}`;

            // push schemas to response
            imports.push(
              `import { ${exportedVariable} as ${schemaImportName} } from "${endpointImportPath}";`,
            );

            request[exportedVariable] =
              `__CODE_START__${schemaImportName}__CODE_END__`;
            // requestRaw[exportedVariable] = schemaImportName;
          }
        }

        // Also add to route tree
        const route_key = endpointMethod
          .replace(/\[|\]/g, "")
          .replace(/-/g, "_");
        route_tree[route_key] = {
          request: request,
          response: response,
          metadata: metadata,
        };
      }
    }
  }

  await iterateDirectory(routesDir, route_tree, []);


  return {
    imports,
    route_tree,
  };
} 