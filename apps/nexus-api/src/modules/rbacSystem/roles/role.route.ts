import { Router } from "express";
import { RoleController, roleControllerInstance } from "./role.controller.js";

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
 * - GET /api/rbac/roles/:roleName: Check if a role exists by name.
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

    /**
     * Route to check roles of user or will return all roles
     * if there are no userId assigned
     *
     * and create role
     */
    router
      .route("/")
      .get(this.roleController.getRolesOfUser)
      .post(this.roleController.createRole);

    // Route to fetch all roles of all users
    router.get("/all-users", this.roleController.getAllRolesOfAllUsers);

    /**
     * Route to get the role by id
     * then update a role information
     * and delete a role
     */
    router
      .route("/:roleId")
      .get(this.roleController.getRoleById)
      .post(this.roleController.updateRole)
      .delete(this.roleController.deleteRole);

    // Route to fetch the users that have no roles
    router.get(
      "/:roleId/users/no-roles",
      this.roleController.getUsersWithoutRoles,
    );

    // Route to check if the role exists (will return a boolean)
    router.get("/:roleName", this.roleController.roleExistsByName);

    /**
     * Route to assign role to user
     * and also remove role from a user
     */
    router
      .route("/:roleId/users/:userId")
      .post(this.roleController.assignRoleToUser)
      .delete(this.roleController.removeRoleFromUser);

    return router;
  };
}

export const roleRouterInstance = new RoleRouter();
