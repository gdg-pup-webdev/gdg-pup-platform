import fs from "fs";
import path from "path";
import { z } from "zod";
import { listExportsSync } from "./utils";

type Tree = {
  [key: string]: string | Tree;
};
/**
   * 
export namespace model {
  export type query = z.infer<typeof api_article_system_articles_articleId_comments_GET_query>;
}
   */

/** 
 infer type of response 
 { [K in keyof typeof api_event_system_checkin_POST_response]: z.infer<typeof api_event_system_checkin_POST_response[K]> }
 */

/** 
  * infer type of request 
  { [K in keyof typeof EndpointSchemas[ "api_article_system_articles_articleId_comments_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_article_system_articles_articleId_comments_GET" ]["request"][K]> }
  */

// Helper: Check if folder is a param (e.g. [userId])
const segmentIsPathParameter = (segment: string) =>
  segment.startsWith("[") && segment.endsWith("]");

export const scanContractModels = async (root: string) => {
  const imports: {
    name: string;
    alias: string;
    path: string;
  }[] = [];

  const tree: Tree = {};

  async function iterateDirectory(
    currentDirectory: string,
    currentTree: any,
    pathStack: string[],
  ) {
    // Read all files and folders in the current directory
    const dirItems = fs.readdirSync(currentDirectory);

    for (const dirItem of dirItems) {
      const fullPath = path.join(currentDirectory, dirItem);
      const pathStats = fs.statSync(fullPath);

      if (pathStats.isDirectory()) {
        /**
         *
         * FOLDER HIT
         *
         */
        const route_key = dirItem.replace(/\[|\]/g, "").replace(/-/g, "_");

        currentTree[route_key] = currentTree[route_key] || {};

        await iterateDirectory(fullPath, currentTree[route_key], [
          ...pathStack,
          dirItem,
        ]);
      } else if (dirItem.endsWith(".ts")) {
        /**
         *
         * FILE HIT
         *
         */
        // METADATA
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
          method: `"${endpointMethod}"`,
          path: `"${endpointRoute}"`,
          signature: `"${endpoint_signature}"`,
        };

        // PROCESS REQUEST STUFF
        const pathParams = pathStack
          .filter(segmentIsPathParameter)
          .map((p) => p.slice(1, -1));
        if (pathParams.length > 0) {
          request["params"] =
            `__CODE_START__z.infer<z.ZodObject<{${pathParams.map((p) => `${p}: z.ZodString`).join(",")}}>>__CODE_END__`;
        }

        // CHECK FILE EXPORTS
        const exports = listExportsSync(actualFilePath);
        for (const exportedVariable of exports) {
          if (exportedVariable === "response") {
            const schemaImportName = `${endpoint_signature}_response`;
            //${schemaImportName}
            /**
             * RESPONSE INFERENCE
             { 
  [K in keyof typeof ${schemaImportName}]: z.infer<(typeof ${schemaImportName})[K]> 
}
             */
            response = `__CODE_START__{ [K in keyof typeof ${schemaImportName}]: z.infer<(typeof ${schemaImportName})[K]> }__CODE_END__`;;
          } else {
            const schemaImportName = `${endpoint_signature}_${exportedVariable}`;

            // push schemas to response
            //${schemaImportName}
            request[exportedVariable] =
              `__CODE_START__z.infer<typeof ${schemaImportName}>__CODE_END__`;
          }
        }

        // Also add to route tree
        const route_key = endpointMethod
          .replace(/\[|\]/g, "")
          .replace(/-/g, "_");
        currentTree[route_key] = {
          request: request,
          response: response,
          metadata: metadata,
        };
      }
    }
  }

  await iterateDirectory(root, tree, []);

  return convertTreeToNamespaceString(tree);
  //   return { imports, tree };
};

export const convertTreeToNamespaceString = (tree: Tree): string => {
  const indent = (level: number) => "  ".repeat(level);

  const recurse = (node: Tree, level: number): string => {
    let lines: string[] = [];

    for (const [key, value] of Object.entries(node)) {
      if (typeof value === "string") {
        // Remove code block markers if they exist in your source data
        const cleanValue = value.replace(/__CODE_START__|__CODE_END__/g, "");
        lines.push(`${indent(level)}export type ${key} = ${cleanValue};`);
      } else {
        lines.push(`${indent(level)}export namespace ${key} {`);
        lines.push(recurse(value, level + 1));
        lines.push(`${indent(level)}}`);
      }
    }

    return lines.join("\n");
  };

  // Wrapping the entire output in the top-level 'models' namespace
  return `export namespace contract {\n${recurse(tree, 1)}\n}`;
};

// "
//     export const namespace models {
//     export namespace api {
//         export type key = ${value of tree leaf}
//     }
//     export namespace health {
//         export type key = ${value of tree leaf}
//     }
// }

// "
