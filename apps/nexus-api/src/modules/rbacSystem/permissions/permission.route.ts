import { Router } from "express";
import {
  PermissionController,
  permissionControllerInstance,
} from "./permission.controller";

export class PermissionRouter {
  constructor(
    private permissionController: PermissionController = permissionControllerInstance,
  ) {}

  getRouter = (): Router => {
    const router = Router();

    router
      .route("/")
      .get(this.permissionController.listPermissions)
      .post(this.permissionController.createPermission);

    router.post("/roles", this.permissionController.assignPermissionToRole);

    router
      .route("/:permissionId")
      .patch(this.permissionController.updatePermission)
      .delete(this.permissionController.deletePermission);

    router.post(
      "/roles/bulk-assign",
      this.permissionController.assignPermissionsToRoleInBulk,
    );

    router.delete(
      "/:permissionId/roles",
      this.permissionController.removePermissionFromRole,
    );

    router.delete(
      "/roles/bulk-remove",
      this.permissionController.removePermissionsFromRoleInBulk,
    );

    return router;
  };
}

export const permissionRouterInstance = new PermissionRouter();
