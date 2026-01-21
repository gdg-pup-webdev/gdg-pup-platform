import { Express } from "express";
import { healthCheckRouterInstance } from "../modules/healthCheck/healthCheck.route.js";
import { learningResourceSystemRouterInstance } from "@/modules/learningResourceSystem/index.js";
import { userRouterInstance } from "@/modules/userSystem/user.route.js";
import { fileSystemRouterInstance } from "@/modules/filesSystem/fileSystem.route.js";
import { leaderboardSystemRouterInstance } from "@/modules/leaderboardSystem/leaderboardSystem.route.js";
import { articleRouterInstance } from "@/modules/publicationSystem/article.route.js";
import { rewardRouterInstance } from "@/modules/rewardsSystem/reward.route.js";
import { teamRouterInstance } from "@/modules/teamsSystem/team.router.js";
import { userResourceSystemRouter } from "@/modules/userResourceSystem/index.js";
import { economySystemRouterInstance } from "@/modules/economySystem/index.js";
import { eventSystemRouterInstance } from "@/modules/eventSystem/index.js";
import { publicationSystemRouterInstance } from "@/modules/publicationSystem/index.js";
import { userSystemRouterInstance } from "@/modules/userSystem/index.js";
import { teamSystemRouterInstance } from "@/modules/teamsSystem/index.js";
import {
  RewardSystemRouter,
  rewardSystemRouterInstance,
} from "@/modules/rewardsSystem/index.js";
import { rewardRepositoryInstance } from "@/modules/rewardsSystem/reward.repository.js";
import { rbacSystemRouterInstance } from "@/modules/rbacSystem/index.js";

export const routesLoader = (app: Express) => {
  app.use("/api/health", healthCheckRouterInstance.getRouter());

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

  /**
   * TODO
   * - file system
   * - leaderboard system
   * - rbac system
   */

  app.use("/api/file-system", fileSystemRouterInstance.getRouter());

  app.use(
    "/api/leaderboard-system",
    leaderboardSystemRouterInstance.getRouter(),
  );

  app.use("/api/rbac-system", rbacSystemRouterInstance.getRouter());
};
