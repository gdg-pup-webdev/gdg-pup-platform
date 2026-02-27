import { Router } from "express";
import { healthCheckModuleRouterInstance } from "@/v0/modules/healthCheck/index.js";
import { learningResourceSystemRouterInstance } from "@/v0/modules/learningResourceSystem/index.js";
import { userResourceSystemRouter } from "@/v0/modules/userResourceSystem/index.js";
import { publicationSystemRouterInstance } from "@/v0/modules/publicationSystem/index.js";
import { userSystemRouterInstance } from "@/v0/modules/userSystem/index.js";
import { teamSystemRouterInstance } from "@/v0/modules/teamsSystem/index.js";
import { rewardSystemRouterInstance } from "@/v0/modules/rewardsSystem/index.js";
import { rbacSystemRouterInstance } from "@/v0/modules/rbacSystem/index.js";
import { authSystemRouterInstance } from "@/v0/modules/authSystem/index.js";
import { memberSystemRouterInstance } from "@/v0/modules/memberSystem/index.js";
 import { economySystemRouterInstance } from "@/v0/modules/walletSystem";
import { eventSystemRouterInstance } from "@/v0/modules/eventSystem";
import { getDeprecationWarningInterceptor } from "../middlewares/deprecatedWarningInterceptor.middleware";

export const loadRoutes = (router: Router) => {
  router.use(getDeprecationWarningInterceptor("v1"));

  router.use("/health", healthCheckModuleRouterInstance.getRouter());
  router.use("/user-resource-system", userResourceSystemRouter.getRouter());
  router.use("/economy-system", economySystemRouterInstance.getRouter());
  router.use("/user-system", userSystemRouterInstance.getRouter());
  router.use(
    "/publication-system",
    publicationSystemRouterInstance.getRouter(),
  );
  router.use("/event-system", eventSystemRouterInstance.getRouter());
  router.use("/team-system", teamSystemRouterInstance.getRouter());
  router.use("/reward-system", rewardSystemRouterInstance.getRouter());
  router.use(
    "/learning-resource-system",
    learningResourceSystemRouterInstance.getRouter(),
  );
  router.use("/rbac-system", rbacSystemRouterInstance.getRouter());
  router.use("/auth-system", authSystemRouterInstance.getRouter());
  router.use("/member-system", memberSystemRouterInstance.getRouter());
};
