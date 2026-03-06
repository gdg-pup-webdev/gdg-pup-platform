import { Router } from "express";
import {
  healthCheckController as healthCheckControllerImport,
  HealthCheckController,
} from "./healthCheck.controller.js";

export class HealthCheckRouter {
  constructor(
    private readonly controller: HealthCheckController = healthCheckControllerImport,
  ) {}

  getRouter() {
    const router: Router = Router();

    router.get("/", this.controller.getHealthCheck);
    return router;
  }
}

export const healthCheckRouterInstance = new HealthCheckRouter();
