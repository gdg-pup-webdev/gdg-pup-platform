/**
 * @description Core Express application setup. This file configures the middleware,
 * loaders, and global settings for the Nexus API.
 */

import express, { Express, Router } from "express";
import { loadLogger } from "./loaders/loadLogger";
import { loadRateLimiter } from "./loaders/loadRateLimiter";
import { loadParsers } from "./loaders/loadParsers";
import { loadErrorHandler } from "./loaders/loadErrorHandler";
import { loadRoutes } from "./loaders/loadRoutes";
import { loadCors } from "./loaders/loadCors";

export class Version1 {
  app: Express;

  constructor() {
    this.app = express();

    loadCors(this.app);
    loadLogger(this.app);
    loadRateLimiter(this.app);
    loadParsers(this.app);
    loadRoutes(this.app);
    loadErrorHandler(this.app);
  }
}
