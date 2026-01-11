import { Router } from "express";
import {
  healthCheckController as healthCheckControllerImport,
  HealthCheckController,
} from "./healthCheck.controller.js";

export class HealthCheckRouter {
  constructor(
    private controller: HealthCheckController = healthCheckControllerImport
  ) {}

  getRouter() {
    const router = Router();

    /**
     * @openapi
     * /api/health:
     *   get:
     *     tags:
     *       - Health
     *     description: Health check endpoint
     *     responses:
     *       200:
     *         description: API is healthy
     *       500:
     *         description: API is not healthy
     */
    router.get("/", this.controller.getHealthCheck);
    return router;
  }
}

export const healthCheckRouterInstance = new HealthCheckRouter();
