import { Express } from "express";
import { healthCheckRouter } from "@/modules/healthCheck/healthCheck.route.js";
 
import { cardSystemRouterInstance } from "@/modules/cardSystem/index.js";

export const routesLoader = (app: Express) => {
  app.use("/api/health", healthCheckRouter.getRouter());
  app.use("/api/card-system", cardSystemRouterInstance.getRouter());
};
