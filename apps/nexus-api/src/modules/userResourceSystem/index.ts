/**
 * @file index.ts
 * @description Entry point for the User Resource System module. 
 * This file aggregates and exposes all resource-related routes (Profiles, Projects, 
 * Achievements, Certificates, and Settings) under a unified router.
 */

import { Router } from "express";
import { ProfileRouter, profileRouterInstance } from "./profiles/profile.route.js";
import { projectRotuerInstance, ProjectRouter } from "./projects/project.route.js";
import {
  achievementRouterInstance,
  AchievementRouter,
} from "./achievements/achievement.route.js";
import {
  certificateRouterInstance,
  CertificateRouter,
} from "./certificates/certificate.route.js";
import { settingsRouterInstance, SettingsRouter } from "./settings/settings.route.js";

/**
 * UserResourceSystemRouter
 * Orchestrates the routing for all resources owned by a user.
 */
export class UserResourceSystemRouter {
  /**
   * @param profileRouter - Router for user profile management.
   * @param projectRouter - Router for user project management.
   * @param achievementRouter - Router for user achievement management.
   * @param certificateRouter - Router for user certificate management.
   * @param settingsRouter - Router for user settings management.
   */
  constructor(
    private readonly profileRouter: ProfileRouter = profileRouterInstance,
    private readonly projectRouter: ProjectRouter = projectRotuerInstance,
    private readonly achievementRouter: AchievementRouter = achievementRouterInstance,
    private readonly certificateRouter: CertificateRouter = certificateRouterInstance,
    private readonly settingsRouter: SettingsRouter = settingsRouterInstance,
  ) {}

  /**
   * getRouter
   * Composes and returns the main router for the User Resource System.
   * @returns {Router} The configured Express router.
   */
  getRouter = (): Router => {
    const router = Router();

    /** Mount sub-routers for specific resource domains */
    router.use("/profiles", this.profileRouter.getRouter());
    router.use("/projects", this.projectRouter.getRouter());
    router.use("/achievements", this.achievementRouter.getRouter());
    router.use("/certificates", this.certificateRouter.getRouter());
    router.use("/settings", this.settingsRouter.getRouter());

    return router;
  };
}

/**
 * Exported singleton instance of the UserResourceSystemRouter.
 */
export const userResourceSystemRouter = new UserResourceSystemRouter();
