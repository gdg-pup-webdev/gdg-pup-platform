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

    router.post("/roles", this.permissionController.assignToRole);

    router
      .route("/:permissionId")
      .get(this.permissionController.getPermission)
      .patch(this.permissionController.updatePermission)
      .delete(this.permissionController.deletePermission);

    router.post(
      "/bulk-create",
      this.permissionController.createPermissionsInBulk,
    );

    router.delete(
      "/:permissionId/bulk-delete",
      this.permissionController.deletePermissionsInBulk,
    );

    router.post(
      "/roles/bulk-assign",
      this.permissionController.assignToRoleInBulk,
    );

    router.delete(
      "/:permissionId/roles",
      this.permissionController.removeFromRole,
    );

    router.delete(
      "/roles/bulk-remove",
      this.permissionController.removeFromRoleInBulk,
    );

    return router;
  };
}

export const permissionRouterInstance = new PermissionRouter();
