import { Router } from "express";
import { RoleController, roleControllerInstance } from "./role.controller";
// import { RoleController, roleControllerInstance } from "./role.controller.js";

/**
 * RoleRouter
 * ==========
 *
 * The RoleRouter class defines all Express routes for role management and user-role assignments in the RBAC system.
 *
 * Responsibilities:
 * - Maps HTTP endpoints to controller methods for all role-related operations.
 * - Supports single and bulk operations for roles and user-role assignments.
 * - Provides RESTful routes for querying, creating, updating, deleting, and assigning roles.
 *
 * Key Routes:
 * - GET /api/rbac/roles: Fetch roles for a user (if userId is provided) or all roles.
 * - POST /api/rbac/roles: Create a new role.
 * - GET /api/rbac/roles/all-users: Fetch all users and their assigned roles.
 * - GET /api/rbac/roles/:roleId: Fetch a role by ID.
 * - POST /api/rbac/roles/:roleId: Update a role.
 * - DELETE /api/rbac/roles/:roleId: Delete a role.
 * - GET /api/rbac/roles/:roleId/users/no-roles: Fetch users without the specified role.
 * - GET /api/rbac/roles/:roleId: Check if a role exists by name.
 * - POST /api/rbac/roles/:roleId/users/:userId: Assign a role to a user.
 * - DELETE /api/rbac/roles/:roleId/users/:userId: Remove a role from a user.
 * - POST /api/rbac/roles/:roleId/bulk/assign: Assign a role to multiple users.
 * - DELETE /api/rbac/roles/:roleId/bulk/remove: Remove a role from multiple users.
 * - POST /api/rbac/roles/users/:userId/bulk/assign: Assign multiple roles to a user.
 * - DELETE /api/rbac/roles/users/:userId/bulk/remove: Remove multiple roles from a user.
 *
 * Usage:
 * - Use getRouter() to obtain the configured Express Router instance.
 * - Integrate this router into your main Express app for full RBAC API support.
 *
 * This router provides a complete and organized set of endpoints for managing roles and user-role relationships.
 */
export class RoleRouter {
  constructor(
    private roleController: RoleController = roleControllerInstance,
  ) {}

  getRouter = (): Router => {
    const router = Router();
    router.get("/", this.roleController.listRoles);

    router.post("/", this.roleController.createOneRole);

    router.delete("/:roleId", this.roleController.deleteOneRole);

    router.get("/:roleId", this.roleController.getOneRole);

    router.patch("/:roleId", this.roleController.updateOneRole);

    router.patch(
      "/:roleId/assign-to-users",
      this.roleController.assignOneRoleToManyUsers,
    );
    router.patch(
      "/:roleId/attach-permissions",
      this.roleController.attachManyPermissionsToOneRole,
    );

    router.patch(
      "/:roleId/detach-permissions",
      this.roleController.detachManyPermissionsFromOneRole,
    );

    router.patch(
      "/:roleId/remove-from-user",
      this.roleController.removeOneRoleFromOneUser,
    );

    return router;
  };
}

export const roleRouterInstance = new RoleRouter();
