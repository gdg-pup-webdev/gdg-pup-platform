import { Express } from "express";
import { healthCheckRoute } from "../modules/healthCheck/healthCheck.route.js";
export const routesLoader = (app: Express) => {
  app.use("/", (req, res) => {
    res.send("Welcome to Identity API");
  });
  app.use("/api/health", healthCheckRoute.getRouter());
};
