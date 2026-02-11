import { tryCatch_deprecated } from "@/utils/tryCatch.util.js";
import { RoleRepository, roleRepositoryInstance } from "./role.repository.js";
import { RepositoryError_DEPRECATED } from "@/classes/ServerError.js";
import { TablesInsert, Tables, TablesUpdate } from "@/types/supabase.types.js";
import { RepositoryResultList } from "@/types/repository.types.js";
import {
  roleFilters,
  roleInsert,
  rolePermissionInsert,
  roleUpdate,
} from "./role.types.js";
import {
  ConflictError,
  InternalServerError,
  NotFoundError,
} from "@/errors/HttpError.js";

type roleRow = Tables<"user_role">;
type userRow = Tables<"user">;
type userRoleJunctionRow = Tables<"user_role_junction">;

/**
 * @deprecated
 */
export type RoleListFilters_DEPRECATED = {
  userId?: string | null;
};

/**
 * RoleService
 * ===========
 *
 * The RoleService class is the business logic layer for role management in the RBAC system.
 *
 * Responsibilities:
 * - Acts as an intermediary between controllers (API layer) and the RoleRepository (database layer).
 * - Wraps all repository calls with error handling using the tryCatch utility, adding context for debugging.
 * - Converts repository errors into ServiceError instances for consistent error handling in higher layers.
 * - Implements business logic for role management, user-role assignments, bulk operations, and permission checks.
 * - Ensures all returned data is properly shaped for controllers and API responses.
 *
 */
export class RoleService {
  constructor(
    private roleRepository: RoleRepository = roleRepositoryInstance,
  ) {}

  listRoles = async (
    pageNumber: number,
    pageSize: number,
    filters: roleFilters,
  ) => {
    console.log("list roles service", filters);
    return await this.roleRepository.listRoles(pageNumber, pageSize, filters);
  };

  createOneRole = async (dto: roleInsert) => {
    const data = await this.roleRepository.createRoles([dto]);

    return data[0];
  };

  assignOneRoleToManyUsers = async (roleId: string, userIds: string[]) => {
    return await this.roleRepository.assignRolesToUsers([roleId], userIds);
  };

  attachManyPermissionsToOneRole = async (
    roleId: string,
    permissions: rolePermissionInsert[],
  ) => {
    return await this.roleRepository.attachPermissionsToRoles(
      [roleId],
      permissions,
    );
  };

  deleteOneRole = async (roleId: string) => {
    return await this.roleRepository.deleteOneRole(roleId);
  };

  getOneRole = async (roleId: string) => {
    const data = await this.roleRepository.listRoles(1, 1, { roleId: roleId });

    if (data.list.length < 1) {
      throw new NotFoundError("Role not found");
    }

    return data.list[0];
  };

  updateOneRole = async (roleId: string, dto: roleUpdate) => {
    return await this.roleRepository.updateOneRole(roleId, dto);
  };

  detachManyPermissionsFromOneRole = async (
    roleId: string,
    permissions: rolePermissionInsert[],
  ) => {
    return await this.roleRepository.detachPermissionsFromRoles(
      [roleId],
      permissions,
    );
  };

  removeOneRoleFromOneUser = async (userId: string, roleId: string) => {
    await this.roleRepository.unassignRolesFromUsers([roleId], [userId]);

    const currentRoles = await this.roleRepository.listRoles(1, 1, {
      userId: userId,
    });

    return currentRoles.list;
  };

  listUsersThatHasRole = async (
    pageNumber: number,
    pageSize: number,
    roleId: string,
  ) => {
    const data = await this.roleRepository.listUsersThatHasRole(
      pageNumber,
      pageSize,
      roleId,
    );

    return data;
  };

  /**
   * Assigns a role to a user.
   * First checks if the user already has the role to prevent duplicates.
   */
  assingOneRoleToOneUser = async (userId: string, roleId: string) => {
    // First, check if user already has this role
    const existingRoles = await this.roleRepository.listRoles(1, 999, {
      userId,
    });

    // Check if the role is already assigned
    const hasRole = existingRoles.list.some((role) => role.id === roleId);
    if (hasRole) throw new ConflictError("User already has this role");

    // Proceed with assignment
    const data = await this.roleRepository.assignRolesToUsers(
      [roleId],
      [userId],
    );

    return data;
  };
}

export const roleServiceInstance = new RoleService();
