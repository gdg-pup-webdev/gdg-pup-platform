/**
 * @file app.ts
 * @description Core Express application setup. This file configures the middleware, 
 * loaders, and global settings for the Nexus API. It is separated from the server 
 * listener (index.ts) to facilitate integration testing using supertest.
 */

import express, { Express } from "express";
import { swaggerLoader } from "./loaders/swagger.loader.js";
import { setupLoader } from "./loaders/setup.loader.js";
import { parsersLoader } from "./loaders/parsers.loader.js";
import { routesLoader } from "./loaders/routes.loader.js";
import { errorHandlerLoader } from "./loaders/errorHandlers.loader.js";

/**
 * Initialize the Express application.
 */
const app: Express = express();

/**
 * setupLoader: Configures security headers, CORS, and other essential application settings.
 */
setupLoader(app);

/**
 * parsersLoader: Configures body-parsing middleware for JSON and URL-encoded data.
 */
parsersLoader(app);

/**
 * swaggerLoader: Initializes OpenAPI/Swagger documentation endpoints.
 */
swaggerLoader(app);

/**
 * routesLoader: Registers all application routers and API endpoints.
 */
routesLoader(app);

/**
 * errorHandlerLoader: Sets up global error-handling middleware for centralized exception management.
 */
errorHandlerLoader(app);

export default app;
