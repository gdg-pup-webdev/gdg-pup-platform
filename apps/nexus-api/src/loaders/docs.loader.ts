import { Express } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { configs } from "../configs/configs.js";
import { generateOpenApiOptions } from "@packages/nexus-api-contracts";
import { apiReference } from "@scalar/express-api-reference";
import converter from "openapi-to-postmanv2";
import { aP } from "vitest/dist/reporters-w_64AS5f.js";
import { ServerError } from "@/errors/ServerError.js";

/**
 * load the documentations of the api
 */
export const docsLoader = (app: Express) => {
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
  });

  /**
   * EXPOSE THE OPENAPI DOCUMENT
   */
  app.use("/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  app.use("/docs-postman.json", (req, res) => {
    // 1. Force the browser to download the file with a specific name
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=collection.postman_collection.json",
    );
    res.setHeader("Content-Type", "application/json");

    converter.convert(
      { type: "json", data: swaggerSpec },
      {
        requestParametersResolution: "Schema",
        exampleParametersResolution: "Schema",
        optimizeConversion: true,
      },
      (err, conversionResult) => {
        // Error handling
        if (
          err ||
          !conversionResult?.result ||
          !conversionResult.output ||
          !conversionResult.output[0] ||
          !conversionResult.output[0].data
        ) {
          return res.status(500).json({
            error: "Conversion failed",
            reason: conversionResult?.reason || err?.message,
          });
        }

        // 2. Move the send logic INSIDE the callback
        const postmandoc = JSON.stringify(
          conversionResult.output[0].data,
          null,
          2,
        );

        // Send the data once it's ready
        res.send(postmandoc);

        return;
      },
    );
  });

  /**
   * LOAD SWAGGER UI DOCUMENTATION
   */
  const swaggerSpec = swaggerJsdoc(options);
  const assetOptions = {
    customCssUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css",
    customJs: [
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js",
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js",
    ],
  };
  app.use(
    "/docs-swagger",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, assetOptions),
  );

  /**
   * LOAD SCALAR DOCUMENTATION
   */
  app.use(
    "/docs",
    apiReference({
      // Top-level properties
      theme: "default",
      content: swaggerSpec,
      darkMode: true,
      hideTestRequestButton: false,
      pageTitle: "Nexus Api Documentation",
    }),
  );

  /**
   * LOAD STOPLIGHT DOCUMENTATION
   */
  app.get("/docs-stoplight", (req, res) => {
    res.send(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <title>API Documentation</title>
        <script src="https://unpkg.com/@stoplight/elements/web-components.min.js"></script>
        <link rel="stylesheet" href="https://unpkg.com/@stoplight/elements/styles.min.css">
        <style>
          /* 1. Wrap text in the CodeMirror editor (Request Body) */
          .sl-code-editor .CodeMirror-line {
            white-space: pre-wrap !important;
            word-break: break-all !important;
          }

          /* 2. Wrap text in the Prism highlighter (Response Body & Samples) */
          pre[class*="language-"],
          code[class*="language-"],
          .sl-panel--request-body [class*="Prism"], 
          .sl-panel--response-body [class*="Prism"] {
            white-space: pre-wrap !important;
            word-wrap: break-word !important;
            word-break: break-word !important;
          }

          /* 3. Remove horizontal scrollbars that force single-line viewing */
          .sl-overflow-x-auto {
            overflow-x: hidden !important;
            white-space: pre-wrap !important;
          }

          /* Optional: Set a dark or light background to the body to prevent white flashes */
          body {
            background-color: #f9fafb;
          }
        </style>
      </head>
      <body style="height: 100vh; overflow-y: hidden;">
        <elements-api 
          apiDescriptionUrl="http://localhost:8000/docs.json" 
          router="hash" 
          layout="sidebar"
        />
      </body>
    </html>
  `);
  });

  /**
   * LOAD RAPI-DOC DOCUMENTATION
   */
  app.get("/docs-rapidoc", (req, res) => {
    res.send(`
 <!doctype html> <!-- Important: must specify -->
<html>
  <head>
    <meta charset="utf-8"> <!-- Important: rapi-doc uses utf8 characters -->
    <script type="module" src="https://unpkg.com/rapidoc/dist/rapidoc-min.js"></script>
  </head>
  <body>
    <rapi-doc
      spec-url = "http://localhost:8000/docs.json"
    > </rapi-doc>
  </body>
</html>
  `);
  });

  console.log(
    `Swagger docs available at http://localhost:${configs.port}/docs-swagger`,
  );
  console.log(
    `Scalar API docs available at http://localhost:${configs.port}/docs`,
  );
};
