import { Express } from "express";
import { healthCheckRoute } from "src/modules/healthCheck/healthCheck.route.js";
export const routesLoader = (app: Express) => {
  app.use("/api/health", healthCheckRoute.getRouter());
};
