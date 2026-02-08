import { Router } from "express"; 

export class PermissionRouter {
  constructor(
    // private permissionController: PermissionController = permissionControllerInstance,
  ) {}

  getRouter = (): Router => {
    const router = Router();

    // Routes without params
    // Bulk Routes
    // router.post(
    //   "/bulk-create",
    //   this.permissionController.createPermissionsInBulk,
    // );
    // router.delete(
    //   "/bulk-delete",
    //   this.permissionController.deletePermissionsInBulk,
    // );
    // router.post(
    //   "/roles/bulk-assign",
    //   this.permissionController.assignToRoleInBulk,
    // );
    // router.delete("/roles/remove", this.permissionController.removeFromRole);
    // router.delete(
    //   "/roles/bulk-remove",
    //   this.permissionController.removeFromRoleInBulk,
    // );

    // // Home Route
    // router
    //   .route("/")
    //   .get(this.permissionController.listPermissions)
    //   .post(this.permissionController.createPermission);

    // router.post("/roles/assign", this.permissionController.assignToRole);

    // // Routes with params
    // router
    //   .route("/:permissionId")
    //   .get(this.permissionController.getPermission)
    //   .patch(this.permissionController.updatePermission)
    //   .delete(this.permissionController.deletePermission);

    return router;
  };
}

export const permissionRouterInstance = new PermissionRouter();
