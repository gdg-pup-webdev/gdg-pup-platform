import { Express } from "express";
import { healthCheckModuleRouterInstance } from "@/modules/healthCheck/index.js";
import { learningResourceSystemRouterInstance } from "@/modules/learningResourceSystem/index.js";
import { fileSystemRouterInstance } from "@/modules/filesSystem/index.js";
import { leaderboardSystemRouterInstance } from "@/modules/leaderboardSystem/leaderboardSystem.route.js";
import { userResourceSystemRouter } from "@/modules/userResourceSystem/index.js";
import { economySystemRouterInstance } from "@/modules/economySystem/index.js";
import { eventSystemRouterInstance } from "@/modules/eventSystem/index.js";
import { publicationSystemRouterInstance } from "@/modules/publicationSystem/index.js";
import { userSystemRouterInstance } from "@/modules/userSystem/index.js";
import { teamSystemRouterInstance } from "@/modules/teamsSystem/index.js";
import { rewardSystemRouterInstance } from "@/modules/rewardsSystem/index.js";
import { rbacSystemRouterInstance } from "@/modules/rbacSystem/index.js"; 
import { ApiVersion1Router } from "@/presentation/routes/v1";
import { authSystemRouterInstance } from "@/modules/authSystem/index.js";
import { memberSystemRouterInstance } from "@/modules/memberSystem/index.js";

export const routesLoader = (app: Express) => {
  /**
   * load version 1 routes
   */
  app.use("/api/v1", new ApiVersion1Router().router);

  /**
   * load legacy routes
   */
  app.use("/api/health", healthCheckModuleRouterInstance.getRouter());

  app.use("/api/user-resource-system", userResourceSystemRouter.getRouter());

  app.use("/api/economy-system", economySystemRouterInstance.getRouter());

  app.use("/api/user-system", userSystemRouterInstance.getRouter());

  app.use(
    "/api/publication-system",
    publicationSystemRouterInstance.getRouter(),
  );

  app.use("/api/event-system", eventSystemRouterInstance.getRouter());

  app.use("/api/team-system", teamSystemRouterInstance.getRouter());

  app.use("/api/reward-system", rewardSystemRouterInstance.getRouter());

  app.use(
    "/api/learning-resource-system",
    learningResourceSystemRouterInstance.getRouter(),
  );

  app.use("/api/rbac-system", rbacSystemRouterInstance.getRouter());
  app.use("/api/auth-system", authSystemRouterInstance.getRouter());
  app.use("/api/member-system", memberSystemRouterInstance.getRouter());
};
