/**
 * @description Core Express application setup. This file configures the middleware,
 * loaders, and global settings for the Nexus API.
 */

import { Express } from "express";
import { setupLoader } from "./presentation/loaders/setup.loader";
import { errorHandlerLoader } from "./presentation/loaders/errorHandlers.loader";
import { parsersLoader } from "./presentation/loaders/parsers.loader";
import { routesLoader } from "./presentation/loaders/routes.loader";

export const loadV1 = (app: Express) => {
  setupLoader(app);
  parsersLoader(app);
  routesLoader(app);
  errorHandlerLoader(app);
};
