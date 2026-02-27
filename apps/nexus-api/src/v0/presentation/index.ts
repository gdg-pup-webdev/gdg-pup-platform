/**
 * @description Core Express application setup. This file configures the middleware,
 * loaders, and global settings for the Nexus API.
 */

import { Express } from "express";
import { setupLoader } from "./loaders/setup.loader";
import { errorHandlerLoader } from "./loaders/errorHandlers.loader";
import { parsersLoader } from "./loaders/parsers.loader";
import { routesLoader } from "./loaders/routes.loader";

export const initializeApp = (app: Express) => {
  setupLoader(app);
  parsersLoader(app);
  routesLoader(app);
  errorHandlerLoader(app);
};
