import z, { ZodType, ZodError } from "zod";
import {
  ContractError,
  EndpointDef,
  inferContext,
  InferHandlerResult,
  inferOutputFunction,
  inferRequest,
  inferResponse,
  RequestHandler,
} from "#types/contract.types.js";
import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'; 

// 1. Extend Zod once here
extendZodWithOpenApi(z);

// --- Controller Factory ---
export const createExpressController = <T extends EndpointDef>(
  schema: T,
  handler: ({
    input,
    ctx,
    output,
  }: {
    input: inferRequest<T>;
    ctx: inferContext<T>;
    output: inferOutputFunction<T>;
  }) => Promise<InferHandlerResult<T>>,
): RequestHandler => {
  return async (req, res, next) => {
    try {
      const { request, response } = schema;

      // -------------------------------------------------
      // 1. INPUT PARSING (Blame Caller)
      // -------------------------------------------------
      // We wrap input parsing to catch ZodErrors and rethrow as Client errors

      let input: any = {};

      try {
        if (request?.query) {
          input.query = await request.query.parseAsync(req.query);
        }
        if (request?.params) {
          input.params = await request.params.parseAsync(req.params);
        }
        if (request?.body) {
          // console.log("validating body");
          // console.log(req.body);
          input.body = await request.body.parseAsync(req.body);
        }
      } catch (err) {
        if (err instanceof ZodError) {
          throw new ContractError(err, "client");
        }
        if (err instanceof ContractError) {
          throw new Error(
            "[@packages/contract-gen:src/server/index.ts/createExpressController] an unknown error occured while validating request.",
          );
        }
        throw err; // Rethrow unknown errors
      }

      // -------------------------------------------------
      // 2. OUTPUT HELPER
      // -------------------------------------------------
      const output = <S extends keyof T["response"]>(
        status: S,
        body: inferResponse<T>[S],
      ) => {
        return { status, body };
      };

      // -------------------------------------------------
      // 3. EXECUTE HANDLER
      // -------------------------------------------------
      const result = await handler({
        input: input as inferRequest<T>,
        ctx: { req, res },
        output,
      });

      // -------------------------------------------------
      // 4. RESPONSE VALIDATION (Blame Implementer)
      // -------------------------------------------------
      const statusCode = result.status;
      const responseValidator = response[
        statusCode as keyof typeof response
      ] as ZodType | undefined;

      if (responseValidator) {
        try {
          await responseValidator.parseAsync(result.body);
        } catch (err) {
          if (err instanceof ZodError) {
            throw new ContractError(err, "server");
          }
          throw err;
        }
      } else {
        console.warn(
          `[Contract Warning] No response schema defined for status ${statusCode as string}`,
        );
      }

      res.status(Number(statusCode)).json(result.body);
    } catch (error) {
      next(error);
    }
  };
};




export const createSwaggerOptions = (endpoints: any): any => {
  const registry = new OpenAPIRegistry();
  const extractPathParams = (path: string): string[] => {
    // Regex: matches anything between { and }
    const regex = /\{([^}]+)\}/g;
    const matches = path.matchAll(regex);

    // Extract the first capturing group from each match
    return Array.from(matches).map((match) => match[1]!);
  };
  endpoints.forEach((endpoint: any) => {
    // 1. Prepare the Responses object safely

    console.log("endpoint", endpoint);
    let formattedResponses: any = {};

    if (endpoint.response) {
      formattedResponses = Object.fromEntries(
        Object.entries(endpoint.response).map(([code, schema]) => [
          code,
          {
            description:
              parseInt(code) < 400 ? "Successful response" : "Error response",
            content: {
              "application/json": {
                schema: schema,
              },
            },
          },
        ]),
      );
    } else {
      // OpenAPI requires at least one response
      formattedResponses = {
        "200": {
          description: "OK",
          content: { "application/json": { schema: z.any() } },
        },
      };
    }

    // 2. Prepare the Request object safely
    const requestConfig: any = {};
    if (endpoint.params) requestConfig.params = endpoint.params;
    if (endpoint.query) requestConfig.query = endpoint.query;
    if (endpoint.body) {
      requestConfig.body = {
        content: { "application/json": { schema: endpoint.body } },
      };
    }

    const pathParams = extractPathParams(endpoint.path);

    if (pathParams.length > 0) {
      requestConfig.params = z.object({
        ...pathParams.reduce(
          (acc, param) => {
            acc[param] = z.string();
            return acc;
          },
          {} as Record<string, z.ZodString>,
        ), // Type the initial {} here
      });
    }

    // 3. Register the path
    registry.registerPath({
      method: endpoint.method.replace(".ts", "").toLowerCase() as any,
      path: endpoint.path,
      summary: `Endpoint for ${endpoint.path}`,
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
      title: "Nexus API",
      version: "1.0.0",
      description: "Generated from openapiendpoints object",
    },
    servers: [
      {
        url: `http://localhost:8000`,
        description: "Development server",
      },
    ],
    // 3. Apply the security globally here
    security: [{ bearerAuth: [] }],
  });

  const options = {
    definition: openApiObject,
    apis: [],
  };

  return options;
};



// 2. Export this specific instance
export { z };