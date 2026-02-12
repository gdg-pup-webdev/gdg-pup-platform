/**
 * @file app.ts
 * @description Core Express application setup. This file configures the middleware,
 * loaders, and global settings for the Nexus API. It is separated from the server
 * listener (index.ts) to facilitate integration testing using supertest.
 */

import express, { Express } from "express";
import { docsLoader } from "./loaders/docs.loader.js";
import { setupLoader } from "./loaders/setup.loader.js";
import { parsersLoader } from "./loaders/parsers.loader.js";
import { routesLoader } from "./loaders/routes.loader.js";
import { errorHandlerLoader } from "./loaders/errorHandlers.loader.js";


const app: Express = express();

setupLoader(app);
parsersLoader(app);
docsLoader(app);
routesLoader(app);
errorHandlerLoader(app);

export default app;
