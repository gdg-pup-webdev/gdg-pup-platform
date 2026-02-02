import { Router } from "express";
import { RoleRouter, roleRouterInstance } from "./roles/role.route.js";
import {
  PermissionRouter,
  permissionRouterInstance,
} from "./permissions/permission.route.js";

export class RbacSystemRouter {
  constructor(
    private readonly roleRouter: RoleRouter = roleRouterInstance,
    private readonly permissionRouter: PermissionRouter = permissionRouterInstance,
  ) {}

  getRouter = (): Router => {
    const router = Router();

    router.use("/roles", this.roleRouter.getRouter());
    router.use("/permissions", this.permissionRouter.getRouter());

    return router;
  };
}

export const rbacSystemRouterInstance = new RbacSystemRouter();
