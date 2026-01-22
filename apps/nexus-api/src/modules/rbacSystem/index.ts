import { Router } from "express";
import { RoleRouter, roleRouterInstance } from "./role.route";

export class RbacSystemRouter {
  constructor(private roleRouter: RoleRouter = roleRouterInstance) {}

  getRouter = (): Router => {
    const router = Router();

    router.use("/roles", this.roleRouter.getRouter());

    return router;
  };
}

export const rbacSystemRouterInstance = new RbacSystemRouter();
