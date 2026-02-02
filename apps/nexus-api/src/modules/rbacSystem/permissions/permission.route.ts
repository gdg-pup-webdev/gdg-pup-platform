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

    router.post("/", this.permissionController.createPermission);

    router
      .route("/:roleId")
      .get(this.permissionController.getPermissionsByRole)
      .post(this.permissionController.assignPermissionToRole);

    router.get("/:userId", this.permissionController.getPermissionByUserId);

    router
      .route("/:permissionId")
      .patch(this.permissionController.updatePermission)
      .delete(this.permissionController.deletePermission);

    router.post(
      "/:roleId/bulk/assign",
      this.permissionController.assignPermissionsToRoleInBulk,
    );

    router.delete(
      "/:roleId/:permissionId",
      this.permissionController.removePermissionFromRole,
    );

    router.delete(
      "/:roleId/bulk/remove",
      this.permissionController.removePermissionsFromRoleInBulk,
    );

    return router;
  };
}

export const permissionRouterInstance = new PermissionRouter();
