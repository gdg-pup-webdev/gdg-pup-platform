import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

export const generateOpenApiOptions = ({
  info = {
    title: "API Documentation",
    version: "1.0.0",
    description: "Generated Documentation",
  },
  servers = [
    { url: "http://localhost:8000", description: "Development server" },
  ],
  security = [{ bearerAuth: [] }],
  generateExample = true,
  openapiendpoints = [],
}: {
  info?: { title: string; version: string; description?: string };
  servers?: { url: string; description?: string }[];
  security?: Record<string, string[]>[];
  generateExample?: boolean;
  openapiendpoints?: any[];
}) => {
  const registry = new OpenAPIRegistry();

  const extractPathParams = (path: string): string[] => {
    const regex = /\{([^}]+)\}/g;
    const matches = path.matchAll(regex);
    return Array.from(matches).map((match) => match[1]!);
  };

  const formatTagFromPath = (path: string) => {
    // this code doesnt include the api version of the endpoint
    // const prefixRegex = /^\/?(api\/)?(v\d+\/)?/;
    // const cleanPath = path.replace(prefixRegex, "");
    // const segments = cleanPath.split("/").filter(Boolean);
    // const domainIndex = 0;
    // const tag = segments[domainIndex] || "api";
    // return tag.replace(/-/g, " ");

    const prefixRegex = /^\/?(?:api\/)?(v\d+)?\/?/;
    const match = path.match(prefixRegex);
    const version = match?.[1] || ""; // e.g., "v1" or ""
    const cleanPath = path.replace(prefixRegex, "");
    const segments = cleanPath.split("/").filter(Boolean);
    const domainIndex = 0;
    const tagName = (segments[domainIndex] || "api").replace(/-/g, " ");
    return version ? `(${version}) ${tagName}` : tagName;
  };

  const addDescriptions = (
    schema: z.ZodObject<any>,
    descriptions: Record<string, string>,
  ) => {
    const shape = schema.shape;
    const newShape = Object.fromEntries(
      Object.entries(shape).map(([key, fieldSchema]) => {
        const description = descriptions[key];
        return [
          key,
          description
            ? (fieldSchema as z.ZodTypeAny).openapi({ description })
            : fieldSchema,
        ];
      }),
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
            description:
              endpoint[`docs_response_${code}`] ||
              (parseInt(code) < 400 ? "Successful response" : "Error response"),
            content: { "application/json": { schema } },
          },
        ]),
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
      const defaultQueryDocs =
        endpoint.query instanceof z.ZodObject
          ? buildDefaultQueryDescriptions(endpoint.query)
          : {};
      requestConfig.query =
        endpoint.query instanceof z.ZodObject
          ? addDescriptions(endpoint.query, {
              ...defaultQueryDocs,
              ...(endpoint.docs_query || {}),
            })
          : endpoint.query;
      // simpler version incase the code above failed coz i did not test anything :)
      // requestConfig.query =
      //   endpoint.query instanceof z.ZodObject
      //     ? addDescriptions(endpoint.query, endpoint.docs_query || {})
      //     : endpoint.query;
    }

    if (endpoint.files || endpoint.body) {
      let contentType = "application/json";
      let requestSchema = endpoint.body;

      if (endpoint.files) {
        contentType = "multipart/form-data";
        // merge files into body schema
        requestSchema = requestSchema.extend(endpoint.files);
      }

      requestConfig.body = {
        description: endpoint.docs_body || `Payload for ${endpoint.path}`,
        content: {
          [contentType]: {
            schema: requestSchema,
            // examples
            ...(endpoint.docs_example_body && generateExample
              ? { example: endpoint.docs_example_body }
              : {}),
          },
        },
      };
    }

    const pathParams = extractPathParams(endpoint.path);
    if (pathParams.length > 0) {
      const paramsSchema = z.object(
        pathParams.reduce(
          (acc, param) => {
            acc[param] = z.string();
            return acc;
          },
          {} as Record<string, z.ZodString>,
        ),
      );
      requestConfig.params = addDescriptions(
        paramsSchema,
        endpoint.docs_params || {},
      );
    }

    //////////// RANDALL PART ////////////

    const { summary, description } = postProcess(
      endpoint,
      pathParams,
      formattedResponses,
      generateExample,
    );

    //////////// RANDALL PART END ////////////

    registry.registerPath({
      method: endpoint.method.replace(".ts", "").toLowerCase() as any,
      path: endpoint.path,
      tags: [formatTagFromPath(endpoint.path)],
      summary,
      description,
      request: requestConfig,
      responses: formattedResponses,
      ...(endpoint.docs_auth === "Public" ||
      endpoint.method.toLowerCase() === "get"
        ? { security: [] }
        : {}),
    });

    // use this code if the one above does not work. I didnt test it :))))
    // registry.registerPath({
    //   method: endpoint.method.replace(".ts", "").toLowerCase() as any,
    //   path: endpoint.path,
    //   tags: [formatTagFromPath(endpoint.path)],
    //   summary: endpoint.docs_summary || `Endpoint for ${endpoint.path}`,
    //   description: endpoint.docs_description || `Endpoint for ${endpoint.path}`,
    //   request: requestConfig,
    //   responses: formattedResponses,
    // });
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

  // force remove generated examples
  // remove examples flag is added to prevent openapi-postmanv2 converter from generating default values to parameters.
  if (!generateExample) {
    const stripExamples = (obj: any) => {
      for (const key in obj) {
        if (key === "example" || key === "examples") {
          delete obj[key];
        } else if (typeof obj[key] === "object" && obj[key] !== null) {
          stripExamples(obj[key]);
        }
      }
    };
    stripExamples(openApiObject);
  }

  return {
    definition: openApiObject as any,
    apis: [],
  };
};

/**
 * POST PROCESS FUNCTION
 * does stuff before writing the openapi spec
 */
const postProcess = (
  endpoint: any,
  pathParams: any,
  formattedResponses: any,
  generateExample: boolean,
) => {
  const extractResourceName = (path: string) => {
    const segments = path.split("/").filter(Boolean);
    const domainIndex = segments[0] === "api" ? 1 : 0;
    const resourceSegments = segments.slice(domainIndex + 1);
    const lastStatic = [...resourceSegments]
      .reverse()
      .find((segment) => !segment.startsWith("{"));
    const base = (lastStatic || segments[domainIndex] || "resource").replace(
      /-/g,
      " ",
    );
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
      parts.push(`Path params: ${pathParams.join(", ")}.`);
    }
    if (queryKeys.length > 0) {
      parts.push(`Query params: ${queryKeys.join(", ")}.`);
    }
    if (hasBody) {
      parts.push("Body: JSON payload (see schema).");
    }
    if (parts.length === 0) return "None.";
    return parts.join(" ");
  };

  const buildOutputsDescription = (responses: Record<string, unknown>) => {
    const successCodes = Object.keys(responses).filter(
      (code) => parseInt(code) < 400,
    );
    if (successCodes.length === 0) return "See response schema.";
    return `Success responses: ${successCodes.join(", ")}.`;
  };

  const buildErrorsDescription = (responses: Record<string, unknown>) => {
    const errorCodes = Object.keys(responses).filter(
      (code) => parseInt(code) >= 400,
    );
    if (errorCodes.length === 0) {
      return "Standard errors: 400, 401, 403, 404, 500.";
    }
    return `Error responses: ${errorCodes.join(", ")}.`;
  };

  const queryKeys =
    endpoint.query instanceof z.ZodObject
      ? Object.keys(endpoint.query.shape)
      : [];
  const isList =
    endpoint.method.toLowerCase() === "get" && pathParams.length === 0;
  const resourceName = extractResourceName(endpoint.path);
  const summary =
    endpoint.docs_summary ||
    `${methodToVerb(endpoint.method, isList)} ${resourceName}`;
  const authNote =
    endpoint.docs_auth ||
    (endpoint.method.toLowerCase() === "get"
      ? "Public."
      : "Requires Bearer token.");
  const description = [
    `Purpose: ${endpoint.docs_description || summary}.`,
    `Inputs: ${buildInputsDescription({ pathParams, queryKeys, hasBody: !!endpoint.body })}`,
    `Outputs: ${buildOutputsDescription(formattedResponses)}`,
    `Errors: ${buildErrorsDescription(formattedResponses)}`,
    `Auth: ${authNote}`,
  ].join("\n\n");

  const responseCodes = Object.keys(formattedResponses);
  responseCodes.forEach((code) => {
    const exampleKey = `docs_example_response_${code}`;
    const example = endpoint[exampleKey];
    if (!example && parseInt(code) < 400) {
      if (endpoint.docs_example_response) {
        formattedResponses[code] = {
          ...formattedResponses[code],
          content: {
            "application/json": {
              schema:
                formattedResponses[code].content["application/json"].schema,
              ...(generateExample
                ? { example: endpoint.docs_example_response }
                : {}),
            },
          },
        };
      }
      return;
    }
    if (example) {
      formattedResponses[code] = {
        ...formattedResponses[code],
        content: {
          "application/json": {
            schema: formattedResponses[code].content["application/json"].schema,
            ...(generateExample ? { example: example } : {}),
          },
        },
      };
    }
  });

  return { summary, description };
};
