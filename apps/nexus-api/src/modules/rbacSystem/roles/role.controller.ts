import { RoleService, roleServiceInstance } from "./role.service.js";
import { contract } from "@packages/nexus-api-contracts";
import { createExpressController } from "@packages/typed-rest";
import { RequestHandler } from "express";

/**
 * RoleController
 * ==============
 *
 * Controller for handling role-related HTTP requests.
 * Implements endpoints defined in the RBAC system contract.
 *
 * Key Endpoints:
 * - GET /api/rbac-system/roles - List all roles (with optional userId filter)
 * - GET /api/rbac-system/roles/:roleId - Get single role by ID
 * - GET /api/rbac-system/roles/all-users - Get all users with their roles
 * - POST /api/rbac-system/roles - Create a new role
 * - PATCH /api/rbac-system/roles/:roleId - Update an existing role
 * - DELETE /api/rbac-system/roles/:roleId - Delete a role
 * - POST /api/rbac-system/roles/:roleId/users/:userId - Assign role to user
 * - DELETE /api/rbac-system/roles/:roleId/users/:userId - Remove role from user
 */
export class RoleController {
  constructor(
    private readonly roleService: RoleService = roleServiceInstance,
  ) {}

  /**
   * GET /api/rbac-system/roles?userId={userId}&pageNumber={n}&pageSize={n}
   * Lists roles with optional filtering by userId and pagination.
   *
   * @route GET /api/rbac-system/roles
   * @query userId - Optional filter to get roles for a specific user
   * @query pageNumber - Current page (1-indexed)
   * @query pageSize - Number of items per page
   * @returns JSON response containing the list of roles and pagination metadata
   * @throws {ServiceError_DEPRECATED} If the service layer encounters an error
   */
  listRoles: RequestHandler = createExpressController(
    contract.api.rbac_system.roles.GET,
    async ({ input, output }) => {
      const { pageNumber, pageSize, userId, resourceName, actionName } =
        input.query;

      const data = await this.roleService.listRoles(pageNumber, pageSize, {
        userId,
        resource: resourceName,
        action: actionName,
      });

      return output(200, {
        status: "success",
        message: "Roles fetched successfully",
        data: data.list.map((role) => {
          const { user_role_permission, ...rest } = role;
          return {
            ...rest,
            permissions: user_role_permission.map((permission) => {
              return {
                resource_name: permission.resource,
                action: permission.action,
              };
            }),
          };
        }),
        meta: {
          totalRecords: data.count,
          totalPages: Math.ceil(data.count / pageSize),
          currentPage: pageNumber,
          pageSize: pageSize,
        },
      });
    },
  );

  /**
   * POST /api/rbac-system/roles
   * Creates a new role.
   *
   * @route POST /api/rbac-system/roles
   * @body data - Role data (role_name, description)
   * @returns JSON response containing the created role
   * @throws {RepositoryError_DEPRECATED} If role name already exists
   * @throws {ServiceError_DEPRECATED} If the service layer encounters an error
   */
  createRole: RequestHandler = createExpressController(
    contract.api.rbac_system.roles.POST,
    async ({ input, output }) => {
      const roleData = input.body.data;

      const data = await this.roleService.createRole(roleData);

      const { user_role_permission, ...rest } = data;

      return output(200, {
        status: "success",
        message: `Role created successfully`,
        data: {
          ...rest,
          permissions: user_role_permission.map((permission) => {
            return {
              resource_name: permission.resource,
              action: permission.action,
            };
          }),
        },
      });
    },
  );

  assignRolesToUser: RequestHandler = createExpressController(
    contract.api.rbac_system.roles.roleName.assign_to_users.PATCH,
    async ({ input, output }) => {
      const { roleName } = input.params;
      const { userId } = input.body.data;

      await this.roleService.assignRolesToUser(userId, [roleName]);

      return output(200, {
        status: "success",
        message: `Roles assigned to user successfully`,
      });
    },
  );

  attachPermissions: RequestHandler = createExpressController(
    contract.api.rbac_system.roles.roleName.attach_permissions.PATCH,
    async ({ input, output }) => {
      const { roleName } = input.params;
      const permissions = input.body.data;

      const data = await this.roleService.attachPermissions(
        roleName,
        permissions.map((permission) => ({
          resource: permission.resource_name,
          action: permission.action,
        })),
      );

      console.log("controller", permissions, data)

      return output(200, {
        status: "success",
        message: `Permissions attached to role successfully`,
        data: data.map((role) => {
          return {
            resource_name: role.resource,
            action: role.action,
          };
        }),
      });
    },
  );

  /**
   * GET /api/rbac-system/roles/:roleId
   * Retrieves a single role by its ID.
   *
   * @route GET /api/rbac-system/roles/:roleId
   * @param roleId - The ID of the role to retrieve
   * @returns JSON response containing the role data
   * @throws {NotFoundError} If the role does not exist
   * @throws {ServiceError_DEPRECATED} If the service layer encounters an error
   */
  // getRole: RequestHandler = createExpressController(
  //   contract.api.rbac_system.roles.roleId.GET,
  //   async ({ input, output }) => {
  //     const { roleId } = input.params;

  //     const { data, error } = await tryCatch_deprecated(
  //       async () => await this.roleService.getRole(roleId),
  //       "calling service to get role",
  //     );

  //     if (error) throw new ServiceError_DEPRECATED(error.message);

  //     if (!data) {
  //       return output(404, {
  //         status: "fail",
  //         message: `Role with ID "${roleId}" not found`,
  //       });
  //     }

  //     return output(200, {
  //       status: "success",
  //       message: "Role fetched successfully",
  //       data,
  //     });
  //   },
  // );

  // /**
  //  * PATCH /api/rbac-system/roles/:roleId
  //  * Updates an existing role.
  //  *
  //  * @route PATCH /api/rbac-system/roles/:roleId
  //  * @param roleId - The ID of the role to update
  //  * @body data - Partial role data to update
  //  * @returns JSON response containing the updated role
  //  * @throws {NotFoundError} If the role does not exist
  //  * @throws {ServiceError_DEPRECATED} If the service layer encounters an error
  //  */
  // updateRole: RequestHandler = createExpressController(
  //   contract.api.rbac_system.roles.roleId.PATCH,
  //   async ({ input, output }) => {
  //     const { roleId } = input.params;
  //     const updates = input.body.data;

  //     const { data, error } = await tryCatch_deprecated(
  //       async () => await this.roleService.updateRole(roleId, updates),
  //       "calling service to update role",
  //     );

  //     if (error) throw new ServiceError_DEPRECATED(error.message);

  //     return output(200, {
  //       status: "success",
  //       message: "Role updated successfully",
  //       data,
  //     });
  //   },
  // );

  // /**
  //  * DELETE /api/rbac-system/roles/:roleId
  //  * Deletes a role.
  //  *
  //  * @route DELETE /api/rbac-system/roles/:roleId
  //  * @param roleId - The ID of the role to delete
  //  * @returns JSON response confirming deletion
  //  * @throws {RepositoryError_DEPRECATED} If role is still assigned to users
  //  * @throws {NotFoundError} If the role does not exist
  //  * @throws {ServiceError_DEPRECATED} If the service layer encounters an error
  //  */
  // deleteRole: RequestHandler = createExpressController(
  //   contract.api.rbac_system.roles.roleId.DELETE,
  //   async ({ input, output }) => {
  //     const { roleId } = input.params;

  //     const { data, error } = await tryCatch_deprecated(
  //       async () => await this.roleService.deleteRole(roleId),
  //       "calling service to delete role",
  //     );

  //     if (error) throw new ServiceError_DEPRECATED(error.message);

  //     return output(200, {
  //       status: "success",
  //       message: "Role deleted successfully",
  //     });
  //   },
  // );

  // /**
  //  * POST /api/rbac-system/roles/:roleId/users/:userId
  //  * Assigns a role to a user.
  //  *
  //  * @route POST /api/rbac-system/roles/:roleId/users/:userId
  //  * @param roleId - The ID of the role to assign
  //  * @param userId - The ID of the user to receive the role
  //  * @returns JSON response containing the assignment data
  //  * @throws {NotFoundError} If role or user does not exist
  //  * @throws {RepositoryError_DEPRECATED} If user already has the role
  //  * @throws {ServiceError_DEPRECATED} If the service layer encounters an error
  //  */
  // assignRole: RequestHandler = createExpressController(
  //   contract.api.rbac_system.roles.roleId.assign_to_users.PATCH,
  //   async ({ input, output }) => {
  //     const roleId = input.params.roleId;
  //     const userId = input.body.userId;

  //     const { data, error } = await tryCatch_deprecated(
  //       async () => await this.roleService.assignRole(userId, roleId),
  //       "calling service to assign role",
  //     );

  //     if (error) throw new ServiceError_DEPRECATED(error.message);

  //     return output(200, {
  //       status: "success",
  //       message: "Role assigned to user successfully",
  //       data,
  //     });
  //   },
  // );

  // /**
  //  * DELETE /api/rbac-system/roles/:roleId/users/:userId
  //  * Removes a role from a user.
  //  *
  //  * @route DELETE /api/rbac-system/roles/:roleId/users/:userId
  //  * @param roleId - The ID of the role to remove
  //  * @param userId - The ID of the user to remove the role from
  //  * @returns JSON response confirming removal
  //  * @throws {ServiceError_DEPRECATED} If the service layer encounters an error
  //  */
  // removeRole: RequestHandler = createExpressController(
  //   contract.api.rbac_system.roles.roleId.detach_permissions.PATCH,
  //   async ({ input, output }) => {
  //     const roleId = input.params.roleId;
  //     const userId = input.body.userId;

  //     const { error } = await tryCatch_deprecated(
  //       async () => await this.roleService.removeRole(userId, roleId),
  //       "calling service to remove role",
  //     );

  //     if (error) throw new ServiceError_DEPRECATED(error.message);

  //     return output(200, {
  //       status: "success",
  //       message: "Role removed from user successfully",
  //     });
  //   },
  // );
}

export const roleControllerInstance = new RoleController();
