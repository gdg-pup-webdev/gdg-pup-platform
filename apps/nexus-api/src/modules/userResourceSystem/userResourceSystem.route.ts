import { Router } from "express";
import {
  AuthMiddleware,
  authMiddlewareInstance,
} from "../../middlewares/auth.middleware.js";
import { projectRotuerInstance, ProjectRouter } from "./project.route.js";

export class UserResourceSystemRouter {
  constructor(
    private projectRouter: ProjectRouter = projectRotuerInstance,
    private authMiddleware: AuthMiddleware = authMiddlewareInstance,
  ) {}

  getRouter() {
    const router: Router = Router();

    router.use("/projects", this.projectRouter.getRouter());

    return router;
  }
}

export const userResourceSystemRouterInstance = new UserResourceSystemRouter();
