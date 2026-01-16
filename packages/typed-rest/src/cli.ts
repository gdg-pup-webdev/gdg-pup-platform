#!/usr/bin/env -S npx tsx

import { Command } from "commander";
import fs from "fs";
import path from "path";
import chokidar from "chokidar";
import { listExportsSync } from "./utils/utils";
import z from "zod";
import { scanModels } from "#utils/models.utils.js";
import { logger } from "#utils/logging.utils.js";

const program = new Command();
program
  .name("contract-gen")
  .description(
    "Generates a single Zod contract object from a file-based API structure"
  )
  .option("-w, --watch", "Watch for file changes and regenerate") // <--- 2. ADD THIS FLAG
  .parse(process.argv);

const options = program.opts();
const MODEL_DIR = path.resolve(process.cwd(), "./src/models");
const SRC_DIR = path.resolve(process.cwd(), "./src/routes");
const OUTPUT_FILE = path.resolve(process.cwd(), "./src/contract.ts");

// Helper: Check if folder is a param (e.g. [userId])
const segmentIsPathParameter = (segment: string) =>
  segment.startsWith("[") && segment.endsWith("]");

async function generate() {
  // hold import statements at the top of the generated file
  const imports: string[] = [];

  let endpoints: {
    [key: string]: {
      request: any;
      response: any;
      metadata: any;
    };
  } = {};

  const requestTypes: string[] = [];
  const responseTypes: string[] = [];
  const endpointTypes: string[] = [];

  let route_tree: any = {};

  async function iterateDirectory(
    currentDirectory: string,
    route_tree: any,
    pathStack: string[]
  ) {
    // Read all files and folders in the current directory
    const dirItems = fs.readdirSync(currentDirectory);

    for (const dirItem of dirItems) {
      const fullPath = path.join(currentDirectory, dirItem);
      const pathStats = fs.statSync(fullPath);

      if (pathStats.isDirectory()) {
        // FOLDER NAME

        const route_key = dirItem.replace(/\[|\]/g, "").replace(/-/g, "_");
        route_tree[route_key.replace(/\[|\]/g, "")] =
          route_tree[route_key] || {};
        await iterateDirectory(
          fullPath,
          route_tree[route_key.replace(/\[|\]/g, "")],
          [...pathStack, dirItem]
        );
      } else if (dirItem.endsWith(".ts")) {
        logger.routeScanner("Scanning route file:", fullPath);

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
              `import { ${exportedVariable} as ${schemaImportName} } from "${endpointImportPath}";`
            );

            response = `__CODE_START__${schemaImportName}__CODE_END__`;
          } else {
            const schemaImportName = `${endpoint_signature}_${exportedVariable}`;

            // push schemas to response
            imports.push(
              `import { ${exportedVariable} as ${schemaImportName} } from "${endpointImportPath}";`
            );

            request[exportedVariable] =
              `__CODE_START__${schemaImportName}__CODE_END__`;
          }
        }

        // ADD TO ENDPOINTS MAP
        endpoints[endpoint_signature] = {
          request: request,
          response: response,
          metadata: metadata,
        };

        // Also add to route tree
        const route_key = endpointMethod
          .replace(/\[|\]/g, "")
          .replace(/-/g, "_");
        route_tree[route_key] = {
          request: request,
          response: response,
          metadata: metadata,
        };

        // add to types
        requestTypes.push(
          `${endpoint_signature} : { [K in keyof typeof EndpointSchemas[ ${'"' + endpoint_signature + '"'} ][${'"' + "request" + '"'}]]: z.infer<typeof EndpointSchemas[ ${'"' + endpoint_signature + '"'} ][${'"' + "request" + '"'}][K]> }`
        );

        responseTypes.push(
          `${endpoint_signature} : { [K in keyof typeof ${endpoint_signature}_response]: z.infer<typeof ${endpoint_signature}_response[K]> }`
        );

        endpointTypes.push(`  ${'"' + endpoint_signature + '"'}: {
          request: { [K in keyof typeof EndpointSchemas[ ${'"' + endpoint_signature + '"'} ][${'"' + "request" + '"'}]]: z.infer<typeof EndpointSchemas[ ${'"' + endpoint_signature + '"'} ][${'"' + "request" + '"'}][K]> };
        response: { [K in keyof typeof ${endpoint_signature}_response]: z.infer<typeof ${endpoint_signature}_response[K]> };
       }`);

        // ${"\"" + "hello world" + "\""}

        // ${`${"\"" + "hello world" + "\""}`}
      }
    }
  }

  await iterateDirectory(SRC_DIR, route_tree, []);

  const models_res = await scanModels(MODEL_DIR);
  imports.push(
    ...models_res.imports.map(
      (i) => `import { ${i.name} as ${i.alias} } from "${i.path}";`
    )
  );
  const modelTreeString = JSON.stringify(models_res.modelTree, null, 2).replace(
    /"__CODE_START__(.*?)__CODE_END__"/g,
    "$1"
  );

  // Serialize the map to a string, but preserve the variable names
  let jsonString = JSON.stringify(endpoints, null, 2);

  // Unwrap the variable names (remove quotes around them)
  // This turns "api_users_GET" string back into the actual object reference
  jsonString = jsonString.replace(/"__CODE_START__(.*?)__CODE_END__"/g, "$1");

  let route_tree_string = JSON.stringify(route_tree, null, 2).replace(
    /"__CODE_START__(.*?)__CODE_END__"/g,
    "$1"
  );

  const fileContent = `
// THIS FILE IS AUTO-GENERATED. DO NOT EDIT. 
// RUN "pnpm contract-gen -i ./src/routes -o ./src/contract.ts" TO SYNC CHANGES.

import {z} from "zod";

${imports.join("\n")}

export const EndpointSchemas = ${jsonString}

export const contract = ${route_tree_string}

export const models = ${modelTreeString}

export type ResponseTypes = {
  ${responseTypes.join(",\n  ")}
}
  
export type RequestTypes = {
  ${requestTypes.join(",\n  ")}
}

export type EndpointTypes = {
  ${endpointTypes.join(",\n  ")}
}
  
export type Responses<T extends keyof ResponseTypes> = ResponseTypes[T];
export type Requests<T extends keyof RequestTypes> = RequestTypes[T];
export type Endpoints<T extends keyof EndpointTypes> = EndpointTypes[T];

`;

  fs.writeFileSync(OUTPUT_FILE, fileContent);
  logger.log("API Contract generated at src/contract.ts");
}

function debounce(func: Function, wait: number) {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
async function run() {
  try {
    // Always run once immediately
    logger.clear();
    await generate();

    if (options.watch) {
      logger.log("Watching for changes in routes and models...");
      const debouncedGenerate = debounce(async () => {
        logger.log("Change detected. Regenerating...");
        try {
          await generate();
        } catch (err) {
          logger.error("❌ Generation failed during watch:", err);
        }
      }, 200);

      // Watch both Routes and Models directories
      const watcher = chokidar.watch([SRC_DIR, MODEL_DIR], {
        ignored: /(^|[\/\\])\../, // ignore dotfiles
        persistent: true,
        ignoreInitial: true,
      });

      watcher
        .on("add", debouncedGenerate)
        .on("change", debouncedGenerate)
        .on("unlink", debouncedGenerate);

      // Keep process alive
    } else {
      process.exit(0);
    }
  } catch (err) {
    logger.error("❌ Generation failed:", err);
    process.exit(1);
  }
}

run();
