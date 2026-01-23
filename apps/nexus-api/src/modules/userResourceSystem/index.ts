import { Router } from "express";
import { ProfileRouter, profileRouterInstance } from "./profile.router.js";
import { projectRotuerInstance, ProjectRouter } from "./project.route.js";
import { achievementRouterInstance, AchievementRouter } from "./achievement.route.js";
import { certificateRouterInstance, CertificateRouter } from "./certificate.route.js";
import { settingsRouterInstance, SettingsRouter } from "./settings.route.js";

export class UserResourceSystemRouter {
  constructor(
    private profileRouter: ProfileRouter = profileRouterInstance,
    private projectRouter: ProjectRouter = projectRotuerInstance,
    private achievementRouter: AchievementRouter = achievementRouterInstance,
    private certificateRouter: CertificateRouter = certificateRouterInstance,
    private settingsRouter: SettingsRouter = settingsRouterInstance,
  ) {}

  getRouter = (): Router => {
    const router = Router();

    router.use("/profiles", this.profileRouter.getRouter());
    router.use("/projects", this.projectRouter.getRouter());
    router.use("/achievements", this.achievementRouter.getRouter());
    router.use("/certificates", this.certificateRouter.getRouter());
    router.use("/settings", this.settingsRouter.getRouter());

    return router;
  };
}

export const userResourceSystemRouter = new UserResourceSystemRouter();
