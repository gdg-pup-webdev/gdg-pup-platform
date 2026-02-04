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
  tags = [],
}: {
  info?: { title: string; version: string; description?: string };
  servers?: { url: string; description?: string }[];
  security?: Record<string, string[]>[];
  tags?: { name: string; description?: string }[];
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

  const formatTagFromPath = (path: string) => {
    const segments = path.split("/").filter(Boolean);
    const domainIndex = segments[0] === "api" ? 1 : 0;
    const tag = segments[domainIndex] || "api";
    return tag.replace(/-/g, " ");
  };

  const extractResourceName = (path: string) => {
    const segments = path.split("/").filter(Boolean);
    const domainIndex = segments[0] === "api" ? 1 : 0;
    const resourceSegments = segments.slice(domainIndex + 1);
    const lastStatic = [...resourceSegments].reverse().find((segment) => !segment.startsWith("{"));
    const base = (lastStatic || segments[domainIndex] || "resource").replace(/-/g, " ");
    if (base.endsWith("s") && !base.endsWith("ss")) {
      return base.slice(0, -1);
    }
    return base;
  };

  const methodToVerb = (method: string, isList: boolean) => {
    const normalized = method.toLowerCase();
    if (normalized === "get") return isList ? "List" : "Get";
    if (normalized === "post") return "Create";
    if (normalized === "patch") return "Update";
    if (normalized === "delete") return "Delete";
    return "Handle";
  };

  const buildDefaultQueryDescriptions = (querySchema: z.ZodObject<any>) => {
    const shape = querySchema.shape;
    const defaults: Record<string, string> = {};
    if ("pageNumber" in shape) {
      defaults.pageNumber = "Page number (default: 1).";
    }
    if ("pageSize" in shape) {
      defaults.pageSize = "Page size (default: 10, max: 50).";
    }
    return defaults;
  };

  const buildInputsDescription = ({
    pathParams,
    queryKeys,
    hasBody,
  }: {
    pathParams: string[];
    queryKeys: string[];
    hasBody: boolean;
  }) => {
    const parts: string[] = [];
    if (pathParams.length > 0) {
      parts.push(\`Path params: \${pathParams.join(", ")}.\`);
    }
    if (queryKeys.length > 0) {
      parts.push(\`Query params: \${queryKeys.join(", ")}.\`);
    }
    if (hasBody) {
      parts.push("Body: JSON payload (see schema).");
    }
    if (parts.length === 0) return "None.";
    return parts.join(" ");
  };

  const buildOutputsDescription = (responses: Record<string, unknown>) => {
    const successCodes = Object.keys(responses).filter((code) => parseInt(code) < 400);
    if (successCodes.length === 0) return "See response schema.";
    return \`Success responses: \${successCodes.join(", ")}.\`;
  };

  const buildErrorsDescription = (responses: Record<string, unknown>) => {
    const errorCodes = Object.keys(responses).filter((code) => parseInt(code) >= 400);
    if (errorCodes.length === 0) {
      return "Standard errors: 400, 401, 403, 404, 500.";
    }
    return \`Error responses: \${errorCodes.join(", ")}.\`;
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
      const defaultQueryDocs = endpoint.query instanceof z.ZodObject
        ? buildDefaultQueryDescriptions(endpoint.query)
        : {};
      requestConfig.query = endpoint.query instanceof z.ZodObject 
        ? addDescriptions(endpoint.query, { ...defaultQueryDocs, ...(endpoint.docs_query || {}) })
        : endpoint.query;
    }

    if (endpoint.body) {
      requestConfig.body = {
        description: endpoint.docs_body || \`Payload for \${endpoint.path}\`,
        content: {
          "application/json": {
            schema: endpoint.body,
            ...(endpoint.docs_example_body
              ? { example: endpoint.docs_example_body }
              : {}),
          },
        },
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

    const queryKeys = endpoint.query instanceof z.ZodObject
      ? Object.keys(endpoint.query.shape)
      : [];
    const isList = endpoint.method.toLowerCase() === "get" && pathParams.length === 0;
    const resourceName = extractResourceName(endpoint.path);
    const summary = endpoint.docs_summary || \`\${methodToVerb(endpoint.method, isList)} \${resourceName}\`;
    const authNote = endpoint.docs_auth || (endpoint.method.toLowerCase() === "get" ? "Public." : "Requires Bearer token.");
    const description = [
      \`Purpose: \${endpoint.docs_description || summary}.\`,
      \`Inputs: \${buildInputsDescription({ pathParams, queryKeys, hasBody: !!endpoint.body })}\`,
      \`Outputs: \${buildOutputsDescription(formattedResponses)}\`,
      \`Errors: \${buildErrorsDescription(formattedResponses)}\`,
      \`Auth: \${authNote}\`,
    ].join("\\n\\n");

    const exampleSuccessCode = Object.keys(formattedResponses).find(
      (code) => parseInt(code) < 400,
    );
    if (exampleSuccessCode && endpoint.docs_example_response) {
      formattedResponses[exampleSuccessCode] = {
        ...formattedResponses[exampleSuccessCode],
        content: {
          "application/json": {
            schema: formattedResponses[exampleSuccessCode].content["application/json"].schema,
            example: endpoint.docs_example_response,
          },
        },
      };
    }

    registry.registerPath({
      method: endpoint.method.replace(".ts", "").toLowerCase() as any,
      path: endpoint.path,
      tags: [formatTagFromPath(endpoint.path)],
      summary,
      description,
      request: requestConfig,
      responses: formattedResponses,
      ...(endpoint.docs_auth === "Public" || endpoint.method.toLowerCase() === "get"
        ? { security: [] }
        : {}),
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
    tags,
  });

  return {
    definition: openApiObject as any,
    apis: [],
  };
};
`;
