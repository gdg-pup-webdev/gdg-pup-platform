import { Express } from "express";
import { healthCheckRouter } from "@/modules/healthCheck/healthCheck.route.js";

import { cardRouterInstance } from "@/modules/cardSystem/card.route.js";

export const routesLoader = (app: Express) => {
  app.use("/api/health", healthCheckRouter.getRouter());
  app.use("/api/card-system", cardRouterInstance.getRouter());
};
