import { Router } from "express";
import { RoleController, roleControllerInstance } from "./role.controller.js";

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

    // Router to assign a role to multiple users (bulk assign)
    router.post("/:roleId/bulk/assign", this.roleController.assignRoleToUsers);

    // Route to remove a role from multiple users (bulk remove)
    router.delete(
      "/:roleId/bulk/remove",
      this.roleController.removeRoleFromUsers,
    );

    // Route to assign multiple roles to a user (bulk assign)
    router.post(
      "/users/:userId/bulk/assign",
      this.roleController.assignRolesToUser,
    );

    // Route to remove multiple roles to a user (bulk remove)
    router.delete(
      "/users/:userId/bulk/remove",
      this.roleController.removeRolesFromUser,
    );

    return router;
  };
}

export const roleRouterInstance = new RoleRouter();
