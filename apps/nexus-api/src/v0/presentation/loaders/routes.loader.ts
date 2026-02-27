import { Express } from "express";
import { healthCheckModuleRouterInstance } from "@/v0/modules/healthCheck/index.js";
import { learningResourceSystemRouterInstance } from "@/v0/modules/learningResourceSystem/index.js";
import { userResourceSystemRouter } from "@/v0/modules/userResourceSystem/index.js";  
import { publicationSystemRouterInstance } from "@/v0/modules/publicationSystem/index.js";
import { userSystemRouterInstance } from "@/v0/modules/userSystem/index.js";
import { teamSystemRouterInstance } from "@/v0/modules/teamsSystem/index.js";
import { rewardSystemRouterInstance } from "@/v0/modules/rewardsSystem/index.js";
import { rbacSystemRouterInstance } from "@/v0/modules/rbacSystem/index.js"; 
import { 
  authSystemRouterInstance,
} from "@/v0/modules/authSystem/index.js";
import { memberSystemRouterInstance } from "@/v0/modules/memberSystem/index.js"; 
import { getDeprecationWarningInterceptor } from "@/v0/presentation/middlewares/deprecatedWarningInterceptor.middleware"; 
import { economySystemRouterInstance } from "@/v0/modules/walletSystem"; 
import { eventSystemRouterInstance } from "@/v0/modules/eventSystem";

export const routesLoader = (app: Express) => { 
  app.use(getDeprecationWarningInterceptor("v1"));

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
