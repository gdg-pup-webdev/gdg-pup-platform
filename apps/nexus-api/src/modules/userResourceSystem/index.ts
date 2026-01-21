import { Router } from "express";
import { ProfileRouter, profileRouterInstance } from "./profile.router";
import { projectRotuerInstance, ProjectRouter } from "./project.route";

export class UserResourceSystemRouter {
  constructor(
    private profileRouter: ProfileRouter = profileRouterInstance,
    private projectRouter: ProjectRouter = projectRotuerInstance,
  ) {}

  getRouter = (): Router => {
    const router = Router();

    router.use("/profiles", this.profileRouter.getRouter());
    router.use("/projects", this.projectRouter.getRouter());

    return router;
  };
}

export const userResourceSystemRouter = new UserResourceSystemRouter();
