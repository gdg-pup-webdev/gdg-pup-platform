import { Express } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { configs } from "../configs/configs.js";
import { openapiendpoints } from "@packages/nexus-api-contracts";

import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
  extendZodWithOpenApi,
} from "@asteasolutions/zod-to-openapi";

import { z } from "zod";

extendZodWithOpenApi(z);

export const swaggerLoader = (app: Express) => {
  const options = createSwaggerOptions([openapiendpoints[0]]);

  const swaggerSpec = swaggerJsdoc(options);

  const assetOptions = {
    customCssUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css",
    customJs: [
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js",
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js",
    ],
  };

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, assetOptions));

  console.log(
    `Swagger docs available at http://localhost:${configs.port}/docs`,
  );
};

export const createSwaggerOptions = (endpoints: any): any => {
  const registry = new OpenAPIRegistry();

  endpoints.forEach((endpoint: any) => {
    // 1. Prepare the Responses object safely

    // console.log("endpoint", endpoint);
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
    if (endpoint.query) {
      console.log("has query");
      console.log(z.toJSONSchema(endpoint.query));
      requestConfig.query = z.object({
        userId: z.string().optional(),
        walletId: z.string().optional(),
      });
    }
    if (endpoint.body) {
      console.log("has body");
      requestConfig.body = {
        content: { "application/json": { schema: endpoint.body } },
      };
    }

    // const pathParams = extractPathParams(endpoint.path);

    // if (pathParams.length > 0) {
    //   requestConfig.params = z.object({
    //     ...pathParams.reduce(
    //       (acc, param) => {
    //         acc[param] = z.string();
    //         return acc;
    //       },
    //       {} as Record<string, z.ZodString>,
    //     ), // Type the initial {} here
    //   });
    // }

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

const extractPathParams = (path: string): string[] => {
  // Regex: matches anything between { and }
  const regex = /\{([^}]+)\}/g;
  const matches = path.matchAll(regex);

  // Extract the first capturing group from each match
  return Array.from(matches).map((match) => match[1]!);
};

// const options = {
//   definition: {
//     openapi: "3.0.0",
//     info: {
//       title: "Nexus API",
//       version: "1.0.0",
//       description: "API documentation for Nexus API",
//     },
//     servers: [
//       {
//         url: `http://localhost:${configs.port}`,
//         description: "Development server",
//       },
//     ],
//     components: {
//       securitySchemes: {
//         bearerAuth: {
//           type: "http",
//           scheme: "bearer",
//           bearerFormat: "JWT",
//         },
//       },
//       schemas: {
//         ErrorResponse: {
//           type: "object",
//           properties: {
//             errors: {
//               type: "array",
//               items: {
//                 type: "object",
//                 properties: {
//                   status: { type: "string" },
//                   title: { type: "string" },
//                   detail: { type: "string" },
//                 },
//               },
//             },
//           },
//         },
//         EventInput: {
//           type: "object",
//           required: ["title"],
//           properties: {
//             title: {
//               type: "string",
//               description: "The title of the event",
//             },
//             description: {
//               type: "string",
//               nullable: true,
//               description: "Detailed description of the event",
//             },
//             start_date: {
//               type: "string",
//               format: "date-time",
//               nullable: true,
//               description: "ISO 8601 start date-time",
//             },
//             end_date: {
//               type: "string",
//               format: "date-time",
//               nullable: true,
//               description: "ISO 8601 end date-time",
//             },
//             venue: {
//               type: "string",
//               nullable: true,
//               description: "Location of the event",
//             },
//             attendance_points: {
//               type: "number",
//               description: "Points awarded for attending",
//             },
//             attendees_count: {
//               type: "number",
//               description: "Initial count of attendees (default 0)",
//             },
//             category: {
//               type: "string",
//               nullable: true,
//               description: "Event category (e.g., Workshop)",
//             },
//           },
//         },
//         AttendeeInput: {
//           type: "object",
//           required: ["eventId", "userId"],
//           properties: {
//             eventId: {
//               type: "string",
//               description: "The ID of the event",
//             },
//             userId: {
//               type: "string",
//               description: "The ID of the user checking in",
//             },
//             checkinMethod: {
//               type: "string",
//               description: "The method of check-in (e.g., QR code, manual)",
//             },
//           },
//         },
//         EventRequestBody: {
//           type: "object",
//           required: ["data"],
//           properties: {
//             data: {
//               $ref: "#/components/schemas/EventInput",
//             },
//           },
//         },
//         AttendeeRequestBody: {
//           type: "object",
//           required: ["data"],
//           properties: {
//             data: {
//               $ref: "#/components/schemas/AttendeeInput",
//             },
//           },
//         },
//         ResourceInput: {
//           type: "object",
//           required: ["title", "resource_url"],
//           properties: {
//             title: {
//               type: "string",
//               description: "The title of the resource",
//             },
//             description: {
//               type: "string",
//               nullable: true,
//               description: "Description of the resource",
//             },
//             resource_url: {
//               type: "string",
//               description: "URL link to the resource",
//             },
//           },
//         },
//         ResourceRequestBody: {
//           type: "object",
//           required: ["data"],
//           properties: {
//             data: {
//               $ref: "#/components/schemas/ResourceInput",
//             },
//           },
//         },
//         UserProjectInput: {
//           type: "object",
//           required: ["title"],
//           properties: {
//             title: {
//               type: "string",
//               description: "The title of the project",
//             },
//             description: {
//               type: "string",
//               nullable: true,
//               description: "Description of the project",
//             },
//             demo_url: {
//               type: "string",
//               nullable: true,
//               description: "URL to the live demo",
//             },
//             repo_url: {
//               type: "string",
//               nullable: true,
//               description: "URL to the repository (e.g., GitHub)",
//             },
//             tech_stack: {
//               type: "string",
//               nullable: true,
//               description:
//                 "Technologies used (e.g., React, Node.js, PostgreSQL)",
//             },
//           },
//         },
//         UserProjectRequestBody: {
//           type: "object",
//           required: ["data"],
//           properties: {
//             data: {
//               $ref: "#/components/schemas/UserProjectInput",
//             },
//           },
//         },
//         ArticleInput: {
//           type: "object",
//           required: ["title"],
//           properties: {
//             title: {
//               type: "string",
//               description: "Title of the article",
//             },
//             body: {
//               type: "string",
//               nullable: true,
//               description: "Content of the article",
//             },
//             is_published: {
//               type: "boolean",
//               description: "Whether the article is published",
//             },
//             related_event_id: {
//               type: "string",
//               nullable: true,
//               description: "ID of the related event",
//             },
//           },
//         },
//         ArticleRequestBody: {
//           type: "object",
//           required: ["data"],
//           properties: {
//             data: {
//               $ref: "#/components/schemas/ArticleInput",
//             },
//           },
//         },
//         ArticleUpdateInput: {
//           type: "object",
//           properties: {
//             title: { type: "string" },
//             body: { type: "string", nullable: true },
//             is_published: { type: "boolean" },
//             related_event_id: { type: "string", nullable: true },
//           },
//         },
//         ArticleUpdateRequestBody: {
//           type: "object",
//           required: ["data"],
//           properties: {
//             data: {
//               $ref: "#/components/schemas/ArticleUpdateInput",
//             },
//           },
//         },
//         CommentInput: {
//           type: "object",
//           required: ["body"],
//           properties: {
//             body: {
//               type: "string",
//               description: "The comment content",
//             },
//           },
//         },
//         CommentRequestBody: {
//           type: "object",
//           required: ["data"],
//           properties: {
//             data: {
//               $ref: "#/components/schemas/CommentInput",
//             },
//           },
//         },
//         CommentUpdateInput: {
//           type: "object",
//           properties: {
//             body: {
//               type: "string",
//               description: "The comment content",
//             },
//           },
//         },
//         CommentUpdateRequestBody: {
//           type: "object",
//           required: ["data"],
//           properties: {
//             data: {
//               $ref: "#/components/schemas/CommentUpdateInput",
//             },
//           },
//         },
//       },
//       responses: {
//         UnauthorizedError: {
//           description: "Unauthorized",
//           content: {
//             "application/json": {
//               schema: {
//                 $ref: "#/components/schemas/ErrorResponse",
//               },
//             },
//           },
//         },
//         ForbiddenError: {
//           description: "Forbidden",
//           content: {
//             "application/json": {
//               schema: {
//                 $ref: "#/components/schemas/ErrorResponse",
//               },
//             },
//           },
//         },
//         NotFoundError: {
//           description: "Not Found",
//           content: {
//             "application/json": {
//               schema: {
//                 $ref: "#/components/schemas/ErrorResponse",
//               },
//             },
//           },
//         },
//         InternalServerError: {
//           description: "Internal Server Error",
//           content: {
//             "application/json": {
//               schema: {
//                 $ref: "#/components/schemas/ErrorResponse",
//               },
//             },
//           },
//         },
//       },
//     },
//     security: [
//       {
//         bearerAuth: [],
//       },
//     ],
//   },
//   apis: [
//     "./src/modules/**/*.route.ts",
//     "./src/modules/**/*.controller.ts",
//     "./src/modules/**/*.model.ts",
//   ],
// };

// console.log("openapiendpoints", openapiendpoints[0]);

// WORKS LOCALLY BUT FAILS WHEN DEPLOYED WITH VERCEL DUE TO STATIC ASSET LOADING ISSUE
// const swaggerSpec = swaggerJsdoc(options);

// // Serve Swagger UI
// app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// // Expose swagger.json
// app.get("/docs.json", (req, res) => {
//   res.setHeader("Content-Type", "application/json");
//   res.send(swaggerSpec);
// });
