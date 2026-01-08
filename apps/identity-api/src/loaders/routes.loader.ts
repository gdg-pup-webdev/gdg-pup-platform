import { Express } from "express";
import { healthCheckRouter } from "@/modules/healthCheck/healthCheck.route.js";

export const routesLoader = (app: Express) => {
  app.use("/api/health", healthCheckRouter.getRouter());
};
