import {
  ListExportOfFilesInDirectory,
  scanFilesInDirectory,
} from "#utils/directory.utils.js";
import { scanContractModels } from "#utils/endpointTypes.utils.js";
import { logger } from "#utils/logging.utils.js";
import { scanPlainModels } from "#utils/modelNamespace.util.js";
import { scanModels } from "#utils/models.utils.js";
import { scanRoutes } from "#utils/routes.utils.js";
import fs from "fs";

export async function generate(
  modelsDir: string,
  routesDir: string,
  outputFilePath: string,
) {
  // 1. Get all files for OpenAPI scanning
  const files = await scanFilesInDirectory(routesDir);

  logger.log("Generating API contract...");

  const imports: string[] = [];

  /**
   * SCAN ROUTES
   */
  logger.log("Scanning routes in:", routesDir);
  const { imports: routeImports, route_tree } = await scanRoutes(routesDir);
  imports.push(...routeImports);
  const route_tree_string = JSON.stringify(route_tree, null, 2).replace(
    /"__CODE_START__(.*?)__CODE_END__"/g,
    "$1",
  );
  const contractTypesTree = await scanContractModels(routesDir);

  /**
   * SCAN MODELS
   */
  logger.log("Scanning models in:", modelsDir);
  const { imports: modelImports, modelTree } = await scanModels(modelsDir);
  imports.push(
    ...modelImports.map(
      (i) => `import { ${i.name} as ${i.alias} } from "${i.path}";`,
    ),
  );
  const modelTreeString = JSON.stringify(modelTree, null, 2).replace(
    /"__CODE_START__(.*?)__CODE_END__"/g,
    "$1",
  );
  const modelTypesTree = await scanPlainModels(modelsDir);

  /**
   * SCAN OPENAPI ENDPOINTS
   */
  logger.log("Creating openapi endpoints in:", routesDir);
  const { listedFiles, imports: listingImports } =
    await ListExportOfFilesInDirectory(routesDir);
  imports.push(...listingImports);
  const listedFilesString = JSON.stringify(listedFiles, null, 2).replace(
    /"__CODE_START__(.*?)__CODE_END__"/g,
    "$1",
  );

  /**
   * GENERATE OPENAPI SPEC [NEW SECTION]
   */
  // logger.log("Generating OpenAPI Spec...");
  // const openApiString = await generateOpenApiSpec(files);
  //   const openApiString = convertOpenApiSpecToString(openApiObject);

  /**
   * GENERATE FILE
   */
  const fileContent = `
// THIS FILE IS AUTO-GENERATED. DO NOT EDIT.
// RUN "pnpm contract-gen -i ./src/routes -o ./src/contract.ts" TO SYNC CHANGES.

import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
  extendZodWithOpenApi,
} from "@asteasolutions/zod-to-openapi";
import {z} from "zod";
extendZodWithOpenApi(z);

${imports.join("\n")}


export const contract = ${route_tree_string}

${contractTypesTree}

export const models = ${modelTreeString}

${modelTypesTree}
  
export const openapiendpoints = ${listedFilesString}
 
${generateOpenApiOptionsString}

`;

  fs.writeFileSync(outputFilePath, fileContent);
  logger.log("API Contract generated at src/contract.ts");
}

export const openApiGenerationScriptString = `
const registry = new OpenAPIRegistry();

const extractPathParams = (path: string): string[] => {
  const regex = /\\{([^}]+)\\}/g;
  const matches = path.matchAll(regex);
  return Array.from(matches).map((match) => match[1]!);
};

const addDescriptions = (schema: z.ZodObject<any>, descriptions: Record<string, string>) => {
  const shape = schema.shape;
  
  const newShape = Object.fromEntries(
    Object.entries(shape).map(([key, fieldSchema]) => {
      const description = descriptions[key];
      // If a description exists for this key, apply it using .openapi()
      return [
        key,
        description ? (fieldSchema as z.ZodTypeAny).openapi({ description }) : fieldSchema
      ];
    })
  );

  return z.object(newShape);
};

openapiendpoints.forEach((endpoint: any) => {
  let formattedResponses: any = {};

  if (endpoint.response) {
    formattedResponses = Object.fromEntries(
      Object.entries(endpoint.response).map(([code, schema]) => [
        code,
        {
          description: endpoint[\`docs_response_\${code}\`] || (parseInt(code) < 400 ? "Successful response" : "Error response"),
          content: {
            "application/json": { schema },
          },
        },
      ])
    );
  } else {
    formattedResponses = {
      "200": {
        description: "OK",
        content: { "application/json": { schema: z.any() } },
      },
    };
  }

  const requestConfig: any = {};
  if (endpoint.query) requestConfig.query = addDescriptions(endpoint.query, endpoint.docs_query || {});
  if (endpoint.body) {
    requestConfig.body = {
      description: endpoint.docs_body || \`Payload for \${endpoint.path}\`,
      content: { "application/json": { schema: endpoint.body } },
    };
  }

  const pathParams = extractPathParams(endpoint.path);
  if (pathParams.length > 0) {
     const paramsSchema = z.object(
      pathParams.reduce((acc, param) => {
        acc[param] = z.string();
        return acc;
      }, {} as Record<string, z.ZodString>)
    );

    requestConfig.params = addDescriptions(paramsSchema, endpoint.docs_params || {})
  }

  registry.registerPath({
    method: endpoint.method.replace(".ts", "").toLowerCase() as any,
    path: endpoint.path,
    tags: [endpoint.path.split("/").slice(0, 2).join("/")],
    summary: endpoint.docs_summary || \`Endpoint for \${endpoint.path}\`,
    description: endpoint.docs_description || \`Endpoint for \${endpoint.path}\`,
    request: requestConfig,
    responses: formattedResponses,
  });
});

registry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
});

const generator = new OpenApiGeneratorV3(registry.definitions);
const openApiObject = generator.generateDocument({
  openapi: "3.0.0",
  info: {
    title: "API Documentation",
    version: "1.0.0",
    description: "Generated with typed-rest",
  },
  servers: [
    {
      url: "http://localhost:8000",
      description: "Development server",
    },
  ],
  security: [{ bearerAuth: [] }],
});

export const options = {
  definition: openApiObject as any,
  apis: [],
};`;


export const generateOpenApiOptionsString = `
export const generateOpenApiOptions = ({
  info = { title: "API Documentation", version: "1.0.0", description: "Generated Documentation" },
  servers = [{ url: "http://localhost:8000", description: "Development server" }],
  security = [{ bearerAuth: [] }],
}: {
  info?: { title: string; version: string; description?: string };
  servers?: { url: string; description?: string }[];
  security?: Record<string, string[]>[];
}) => {
  const registry = new OpenAPIRegistry();

  const extractPathParams = (path: string): string[] => {
    const regex = /\\{([^}]+)\\}/g;
    const matches = path.matchAll(regex);
    return Array.from(matches).map((match) => match[1]!);
  };

  const addDescriptions = (schema: z.ZodObject<any>, descriptions: Record<string, string>) => {
    const shape = schema.shape;
    const newShape = Object.fromEntries(
      Object.entries(shape).map(([key, fieldSchema]) => {
        const description = descriptions[key];
        return [
          key,
          description ? (fieldSchema as z.ZodTypeAny).openapi({ description }) : fieldSchema
        ];
      })
    );
    return z.object(newShape);
  };

  // Iterating through the global openapiendpoints variable
  openapiendpoints.forEach((endpoint: any) => {
    let formattedResponses: any = {};

    if (endpoint.response) {
      formattedResponses = Object.fromEntries(
        Object.entries(endpoint.response).map(([code, schema]) => [
          code,
          {
            description: endpoint[\`docs_response_\${code}\`] || (parseInt(code) < 400 ? "Successful response" : "Error response"),
            content: { "application/json": { schema } },
          },
        ])
      );
    } else {
      formattedResponses = {
        "200": {
          description: "OK",
          content: { "application/json": { schema: z.any() } },
        },
      };
    }

    const requestConfig: any = {};
    
    if (endpoint.query) {
      requestConfig.query = endpoint.query instanceof z.ZodObject 
        ? addDescriptions(endpoint.query, endpoint.docs_query || {})
        : endpoint.query;
    }

    if (endpoint.body) {
      requestConfig.body = {
        description: endpoint.docs_body || \`Payload for \${endpoint.path}\`,
        content: { "application/json": { schema: endpoint.body } },
      };
    }

    const pathParams = extractPathParams(endpoint.path);
    if (pathParams.length > 0) {
      const paramsSchema = z.object(
        pathParams.reduce((acc, param) => {
          acc[param] = z.string();
          return acc;
        }, {} as Record<string, z.ZodString>)
      );
      requestConfig.params = addDescriptions(paramsSchema, endpoint.docs_params || {});
    }

    registry.registerPath({
      method: endpoint.method.replace(".ts", "").toLowerCase() as any,
      path: endpoint.path,
      tags: [endpoint.path.split("/").filter(Boolean).slice(0, 2).join("/")],
      summary: endpoint.docs_summary || \`Endpoint for \${endpoint.path}\`,
      description: endpoint.docs_description || \`Endpoint for \${endpoint.path}\`,
      request: requestConfig,
      responses: formattedResponses,
    });
  });

  registry.registerComponent("securitySchemes", "bearerAuth", {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
  });

  const generator = new OpenApiGeneratorV3(registry.definitions);
  
  const openApiObject = generator.generateDocument({
    openapi: "3.0.0",
    info,
    servers,
    security,
  });

  return {
    definition: openApiObject as any,
    apis: [],
  };
};
`;