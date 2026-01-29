import { Router } from "express";
import { RoleController, roleControllerInstance } from "./role.controller";

export class RoleRouter {
  constructor(
    private roleController: RoleController = roleControllerInstance,
  ) {}

  getRouter = (): Router => {
    const router = Router();

    /**
     * Get routes
     */

    router
      .route("/")
      .get(this.roleController.getRolesOrUser)
      .post(this.roleController.createRole);

    router.get("/all-users", this.roleController.getAllRolesOfAllUsers);

    router.get("/:roleId", this.roleController.getRoleById);

    return router;
  };
}

export const roleRouterInstance = new RoleRouter();
