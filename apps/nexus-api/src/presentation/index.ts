/**
 * @file app.ts
 * @description Core Express application setup. This file configures the middleware,
 * loaders, and global settings for the Nexus API. It is separated from the server
 * listener (index.ts) to facilitate integration testing using supertest.
 */

import { docsLoader } from "@/loaders/docs.loader";
import { errorHandlerLoader } from "@/loaders/errorHandlers.loader";
import { parsersLoader } from "@/loaders/parsers.loader"; 
import { routesLoader } from "@/loaders/routes.loader";
import { setupLoader } from "@/loaders/setup.loader";
import express, { Express } from "express"; 

const app: Express = express();

setupLoader(app);
parsersLoader(app);

/////////////////////////////////////////////////////
// LOADING ROUTES
 
routesLoader(app);

/////////////////////////////////////////////////////

errorHandlerLoader(app);

export default app;
