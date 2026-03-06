/**
 * @description Core Express application setup. This file configures the middleware,
 * loaders, and global settings for the Nexus API.
 */

import express, { Express, Router } from "express";
import { loadErrorHandler } from "./loaders/loadErrorHandler";
import { loadRoutes } from "./loaders/loadRoutes";
import { loadParsers } from "./loaders/loadParsers";

export class Version0 {
  app: Express;

  constructor() {
    this.app = express();

    loadParsers(this.app);
    loadRoutes(this.app);
    loadErrorHandler(this.app);
  }
}
