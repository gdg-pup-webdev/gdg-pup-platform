import { Router } from "express";
import { RolesHttpController } from "./roles.controller";

export class RolesRouter {
  router: Router;

  constructor(private rolesHttpController: RolesHttpController) {
    // private filesHttpController: FilesHttpController,
    // private authMiddleware: AuthMiddleware = authMiddlewareInstance,
    this.router = Router();

    this.router.get("/", this.rolesHttpController.listRoles);
    this.router.post("/", this.rolesHttpController.createRole);
    this.router.delete("/:roleName", this.rolesHttpController.deleteRole);
    this.router.get("/:roleName", this.rolesHttpController.getOne);

    this.router.post(
      "/:roleName/permissions",
      this.rolesHttpController.addPermission,
    );
    this.router.patch(
      "/:roleName/permissions",
      this.rolesHttpController.deletePermission,
    );
  }
}
