/**
 * @description Core Express application setup. This file configures the middleware,
 * loaders, and global settings for the Nexus API.
 */

import express, { Express, Router } from "express";
import { loadErrorHandler } from "./loaders/loadErrorHandler";
import { loadRoutes } from "./loaders/loadRoutes";
import { loadParsers } from "./loaders/loadParsers";
import { loadSecurityHeaders } from "../loaders/loadSecurityHeaders";

export class Version1 {
  app: Express;

  constructor() {
    this.app = express();

    loadSecurityHeaders(this.app);

    loadParsers(this.app);
    loadRoutes(this.app);
    loadErrorHandler(this.app);
  }
}
