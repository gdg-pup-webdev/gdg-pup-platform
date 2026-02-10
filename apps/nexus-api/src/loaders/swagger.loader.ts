import { Express } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { configs } from "../configs/configs.js";
import { generateOpenApiOptions } from "@packages/nexus-api-contracts";
export const swaggerLoader = (app: Express) => {
  const options = generateOpenApiOptions({
    info: {
      title: "Nexus API",
      version: "2.1.0",
      description: [
        "Documentation for the GDG PUP Platform Nexus API.",
        "Auth: Use `Authorization: Bearer <token>` for protected endpoints.",
        "Public endpoints are marked without a lock icon in Swagger.",
      ].join(" "),
    },
    servers: [{ url: "http://localhost:8000", description: "Local Dev" }],
    tags: [
      {
        name: "event system",
        description: "Events, attendees, and check-ins.",
      },
      {
        name: "learning resource system",
        description: "External resources and study jams.",
      },
      {
        name: "user resource system",
        description:
          "User profiles, projects, achievements, certificates, settings.",
      },
      {
        name: "publication system",
        description: "Articles, comments, highlights.",
      },
      {
        name: "team system",
        description: "Teams and members.",
      },
      {
        name: "economy system",
        description: "Wallets and transactions.",
      },
      {
        name: "rbac system",
        description: "Roles and permissions.",
      },
      {
        name: "file system",
        description: "File upload and metadata.",
      },
      {
        name: "reward system",
        description: "Rewards and claims.",
      },
      {
        name: "leaderboard system",
        description: "Leaderboard data.",
      },
      {
        name: "health",
        description: "Service health checks.",
      },
    ],
  });

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

  app.use("/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log(
    `Swagger docs available at http://localhost:${configs.port}/docs`,
  );
};

export const swaggerLoaderManual = (app: Express) => {
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Nexus API",
        version: "1.0.0",
        description: "API documentation for Nexus API",
      },
      servers: [
        {
          url: `http://localhost:${configs.port}`,
          description: "Development server",
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
        schemas: {
          ErrorResponse: {
            type: "object",
            properties: {
              errors: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    status: { type: "string" },
                    title: { type: "string" },
                    detail: { type: "string" },
                  },
                },
              },
            },
          },
          EventInput: {
            type: "object",
            required: ["title"],
            properties: {
              title: {
                type: "string",
                description: "The title of the event",
              },
              description: {
                type: "string",
                nullable: true,
                description: "Detailed description of the event",
              },
              start_date: {
                type: "string",
                format: "date-time",
                nullable: true,
                description: "ISO 8601 start date-time",
              },
              end_date: {
                type: "string",
                format: "date-time",
                nullable: true,
                description: "ISO 8601 end date-time",
              },
              venue: {
                type: "string",
                nullable: true,
                description: "Location of the event",
              },
              attendance_points: {
                type: "number",
                description: "Points awarded for attending",
              },
              attendees_count: {
                type: "number",
                description: "Initial count of attendees (default 0)",
              },
              category: {
                type: "string",
                nullable: true,
                description: "Event category (e.g., Workshop)",
              },
            },
          },
          AttendeeInput: {
            type: "object",
            required: ["eventId", "userId"],
            properties: {
              eventId: {
                type: "string",
                description: "The ID of the event",
              },
              userId: {
                type: "string",
                description: "The ID of the user checking in",
              },
              checkinMethod: {
                type: "string",
                description: "The method of check-in (e.g., QR code, manual)",
              },
            },
          },
          EventRequestBody: {
            type: "object",
            required: ["data"],
            properties: {
              data: {
                $ref: "#/components/schemas/EventInput",
              },
            },
          },
          AttendeeRequestBody: {
            type: "object",
            required: ["data"],
            properties: {
              data: {
                $ref: "#/components/schemas/AttendeeInput",
              },
            },
          },
          ResourceInput: {
            type: "object",
            required: ["title", "resource_url"],
            properties: {
              title: {
                type: "string",
                description: "The title of the resource",
              },
              description: {
                type: "string",
                nullable: true,
                description: "Description of the resource",
              },
              resource_url: {
                type: "string",
                description: "URL link to the resource",
              },
            },
          },
          ResourceRequestBody: {
            type: "object",
            required: ["data"],
            properties: {
              data: {
                $ref: "#/components/schemas/ResourceInput",
              },
            },
          },
          UserProjectInput: {
            type: "object",
            required: ["title"],
            properties: {
              title: {
                type: "string",
                description: "The title of the project",
              },
              description: {
                type: "string",
                nullable: true,
                description: "Description of the project",
              },
              demo_url: {
                type: "string",
                nullable: true,
                description: "URL to the live demo",
              },
              repo_url: {
                type: "string",
                nullable: true,
                description: "URL to the repository (e.g., GitHub)",
              },
              tech_stack: {
                type: "string",
                nullable: true,
                description:
                  "Technologies used (e.g., React, Node.js, PostgreSQL)",
              },
            },
          },
          UserProjectRequestBody: {
            type: "object",
            required: ["data"],
            properties: {
              data: {
                $ref: "#/components/schemas/UserProjectInput",
              },
            },
          },
          ArticleInput: {
            type: "object",
            required: ["title"],
            properties: {
              title: {
                type: "string",
                description: "Title of the article",
              },
              body: {
                type: "string",
                nullable: true,
                description: "Content of the article",
              },
              is_published: {
                type: "boolean",
                description: "Whether the article is published",
              },
              related_event_id: {
                type: "string",
                nullable: true,
                description: "ID of the related event",
              },
            },
          },
          ArticleRequestBody: {
            type: "object",
            required: ["data"],
            properties: {
              data: {
                $ref: "#/components/schemas/ArticleInput",
              },
            },
          },
          ArticleUpdateInput: {
            type: "object",
            properties: {
              title: { type: "string" },
              body: { type: "string", nullable: true },
              is_published: { type: "boolean" },
              related_event_id: { type: "string", nullable: true },
            },
          },
          ArticleUpdateRequestBody: {
            type: "object",
            required: ["data"],
            properties: {
              data: {
                $ref: "#/components/schemas/ArticleUpdateInput",
              },
            },
          },
          CommentInput: {
            type: "object",
            required: ["body"],
            properties: {
              body: {
                type: "string",
                description: "The comment content",
              },
            },
          },
          CommentRequestBody: {
            type: "object",
            required: ["data"],
            properties: {
              data: {
                $ref: "#/components/schemas/CommentInput",
              },
            },
          },
          CommentUpdateInput: {
            type: "object",
            properties: {
              body: {
                type: "string",
                description: "The comment content",
              },
            },
          },
          CommentUpdateRequestBody: {
            type: "object",
            required: ["data"],
            properties: {
              data: {
                $ref: "#/components/schemas/CommentUpdateInput",
              },
            },
          },
        },
        responses: {
          UnauthorizedError: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          ForbiddenError: {
            description: "Forbidden",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          NotFoundError: {
            description: "Not Found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          InternalServerError: {
            description: "Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
    apis: [
      "./src/modules/**/*.route.ts",
      "./src/modules/**/*.controller.ts",
      "./src/modules/**/*.model.ts",
    ],
  };

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
