import { Express } from "express";
import { healthCheckRouterInstance } from "../modules/healthCheck/healthCheck.route.js";
import { leaderboardSystemRouterInstance } from "@/modules/leaderboardSystem/leaderboardSystem.route.js";
import { userSystemRouterInstance } from "@/modules/users/userSystem.route.js";
import { articleRouterInstance } from "@/modules/articleSystem/articleSystem.route.js";
import { eventSystemRouterInstance } from "@/modules/eventSystem/evenSystem.route.js";
import { resourceSystemRouterInstance } from "@/modules/resourceSystem/resourceSystem.route.js";

export const routesLoader = (app: Express) => {
  app.use("/api/article-system", articleRouterInstance.getRotuer());
  app.use("/api/event-system", eventSystemRouterInstance.getRouter());
  app.use("/api/health", healthCheckRouterInstance.getRouter());
  app.use("/api/leaderboard", leaderboardSystemRouterInstance.getRouter());
  app.use("/api/resource-system", resourceSystemRouterInstance.getRouter());
  app.use("/api/users", userSystemRouterInstance.getRouter());
};
