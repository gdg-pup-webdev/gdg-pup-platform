import { Router } from "express";
import { UsersHttpController } from "./user.controller.js";
import { AchievementsRouter } from "./achievements/achievement.route.js";
import { CertificatesRouter } from "./certificates/certificate.route.js";
import { PointsRouter } from "./points/points.route.js";
import { ProfilesRouter } from "./profiles/profile.route.js";
import { ProjectsRouter } from "./projects/project.route.js";
import { SettingsRouter } from "./settings/settings.route.js";

export class UsersRouter {
  router: Router;

  constructor(
    private readonly userSystemController: UsersHttpController,
    private achievementsRouter: AchievementsRouter,
    private certificatesRouter: CertificatesRouter,
    private pointsRouter: PointsRouter,
    private profilesRouter: ProfilesRouter,
    private projectsRouter: ProjectsRouter,
    private settingsRouter: SettingsRouter,
  ) {
    this.router = Router();

    this.router.get("/", this.userSystemController.listUsers);

    this.router.get("/:userId", this.userSystemController.getUserById);

    this.router.get(
      "/:userId/aggregate",
      this.userSystemController.getUserAggregate,
    );

    this.router.use("/:userId/achievements", this.achievementsRouter.router);
    this.router.use("/:userId/certificates", this.certificatesRouter.router);
    this.router.use("/:userId/points", this.pointsRouter.router);
    this.router.use("/:userId/profiles", this.profilesRouter.router);
    this.router.use("/:userId/projects", this.projectsRouter.router);
    this.router.use("/:userId/settings", this.settingsRouter.router);
  }
}
