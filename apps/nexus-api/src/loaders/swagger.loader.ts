import { Express } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { configs } from "../configs/configs.js";

export const swaggerLoader = (app: Express) => {
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
                description: "Technologies used (e.g., React, Node.js, PostgreSQL)",
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

  // Serve Swagger UI
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Expose swagger.json
  app.get("/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log(
    `Swagger docs available at http://localhost:${configs.port}/docs`
  );
};