import { Router } from "express";
import { RoleRouter, roleRouterInstance } from "./roles/role.route.js"; 

export class RbacSystemRouter {
  constructor(
    private readonly roleRouter: RoleRouter = roleRouterInstance, 
  ) {}

  getRouter = (): Router => {
    const router = Router();

    router.use("/roles", this.roleRouter.getRouter()); 

    return router;
  };
}

export const rbacSystemRouterInstance = new RbacSystemRouter();
