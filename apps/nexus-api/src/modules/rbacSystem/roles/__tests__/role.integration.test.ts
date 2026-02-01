import { describe, expect, it } from "vitest";
import { RoleRepository } from "../role.repository.js";
import { RoleService } from "../role.service.js";
import {
  roleFixture,
  userFixture,
  roleJunctionFixture,
  permissionFixture,
  listResult,
  rbacPagination,
} from "../../__tests__/test-helpers.js";

describe("RoleRepository and RoleService (integration)", () => {
  const repo = new RoleRepository();
  const service = new RoleService(repo);

  // Mock repository methods for isolated testing
  repo.getAllRolesOfAllUsers = async (pageNumber, pageSize) =>
    listResult([{ user: userFixture, roles: [roleFixture] }]);
  repo.getRolesOfUser = async (userId) => listResult([roleFixture]);
  repo.getAllRoles = async () => listResult([roleFixture]);
  repo.getRoleById = async (roleId) => roleFixture;
  repo.roleExistsByName = async (roleName) => roleName === "admin";
  repo.getUsersByRole = async (roleId) => listResult([roleJunctionFixture]);
  repo.getUsersWithoutRoles = async (roleId) => listResult([userFixture]);
  repo.createRole = async (roleData) => ({ ...roleData, id: "role-2" });
  repo.updateRole = async (roleId, updates) => ({ ...roleFixture, ...updates });
  repo.deleteRole = async (roleId) => ({ success: true });
  repo.assignRoleToUser = async (userId, roleId) => roleJunctionFixture;
  repo.removeRoleFromUser = async (userId, roleId) => ({ success: true });

  it("getAllRolesOfAllUsers returns paginated user-role list", async () => {
    const result = await service.getAllRolesOfAllUsers(
      rbacPagination.pageNumber,
      rbacPagination.pageSize,
    );
    expect(result.list[0].user).toEqual(userFixture);
    expect(result.list[0].roles[0]).toEqual(roleFixture);
  });

  it("getRolesOfUser returns roles for a user", async () => {
    const result = await service.getRolesOfUser("user-1");
    expect(result.list[0]).toEqual(roleFixture);
  });

  it("getAllRoles returns all roles", async () => {
    const result = await service.getAllRoles();
    expect(result.list[0]).toEqual(roleFixture);
  });

  it("getRoleById returns a role", async () => {
    const result = await service.getRoleById("role-1");
    expect(result).toEqual(roleFixture);
  });

  it("roleExistsByName returns true for existing role", async () => {
    const exists = await service.roleExistsByName("admin");
    expect(exists).toBe(true);
  });

  it("getUsersByRole returns user-role junctions", async () => {
    const result = await service.getUsersByRole("role-1");
    expect(result.list[0]).toEqual(roleJunctionFixture);
  });

  it("getUsersWithoutRoles returns users", async () => {
    const result = await service.getUsersWithoutRoles("role-1");
    expect(result.list[0]).toEqual(userFixture);
  });

  it("createRole creates a new role", async () => {
    const result = await service.createRole({
      role_name: "moderator",
      description: "Moderator role",
    });
    expect(result.role_name).toBe("moderator");
    expect(result.id).toBe("role-2");
  });

  it("updateRole updates a role", async () => {
    const result = await service.updateRole("role-1", {
      description: "Updated",
    });
    expect(result.description).toBe("Updated");
  });

  it("deleteRole deletes a role", async () => {
    const result = await service.deleteRole("role-1");
    expect(result.success).toBe(true);
  });

  it("assignRoleToUser assigns a role to a user", async () => {
    const result = await service.assignRoleToUser("user-1", "role-1");
    expect(result).toEqual(roleJunctionFixture);
  });

  it("removeRoleFromUser removes a role from a user", async () => {
    const result = await service.removeRoleFromUser("user-1", "role-1");
    expect(result.success).toBe(true);
  });
});
