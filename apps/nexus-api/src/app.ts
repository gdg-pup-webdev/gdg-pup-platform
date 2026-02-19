/**
 * @file app.ts
 * @description Core Express application setup. This file configures the middleware,
 * loaders, and global settings for the Nexus API. It is separated from the server
 * listener (index.ts) to facilitate integration testing using supertest.
 */

import { errorHandlerLoader } from "@/presentation/loaders/errorHandlers.loader";
import { parsersLoader } from "@/presentation/loaders/parsers.loader";
import { routesLoader } from "@/presentation/loaders/routes.loader";
import { setupLoader } from "@/presentation/loaders/setup.loader";
import express, { Express } from "express";

const app: Express = express();

setupLoader(app);
parsersLoader(app);

routesLoader(app);

errorHandlerLoader(app);

export default app;
