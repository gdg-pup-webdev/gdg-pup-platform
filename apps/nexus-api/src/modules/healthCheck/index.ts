import { Router } from "express";
import { healthCheckRouterInstance } from "./health/healthCheck.route.js";

export class HealthCheckModuleRouter {
  private readonly router: Router = Router();

  constructor() {
    // Mount the health feature at the module root so /api/health stays stable.
    this.router.use("/", healthCheckRouterInstance.getRouter());
  }

  getRouter() {
    return this.router;
  }
}

export const healthCheckModuleRouterInstance = new HealthCheckModuleRouter();
