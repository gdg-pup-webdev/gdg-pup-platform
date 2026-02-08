/**
 * Permission service unit tests.
 *
 * Tests business logic layer for permission management, including error handling
 * and conversion of repository errors to service errors.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  RepositoryError,
  ServiceError,
  NotFoundError,
  DatabaseError,
} from "../../../../classes/ServerError.js";
import { permissionFixture } from "../../__tests__/test-helpers.js";
import { PermissionService } from "../permission.service.js";

const { repoGetPermissionsByRole, repoAssignPermissionToRole } = vi.hoisted(
  () => ({
    repoGetPermissionsByRole: vi.fn(),
    repoAssignPermissionToRole: vi.fn(),
  }),
);

vi.mock("../permission.repository.js", () => ({
  permissionRepositoryInstance: {
    getPermissionsByRole: repoGetPermissionsByRole,
    assignPermissionToRole: repoAssignPermissionToRole,
  },
  PermissionRepository: class {},
}));

describe("permission.service (unit)", () => {
  const service = new PermissionService();

  beforeEach(() => {
    repoGetPermissionsByRole.mockReset();
    repoAssignPermissionToRole.mockReset();
  });

  describe("getPermissionsByRole", () => {
    it("returns permissions for role on success", async () => {
      const mockResult = {
        list: [permissionFixture],
        count: 1,
      };
      repoGetPermissionsByRole.mockResolvedValue(mockResult);

      const result = await service.getPermissionsByRole("role-1");

      expect(result).toEqual(mockResult);
      expect(repoGetPermissionsByRole).toHaveBeenCalledWith("role-1");
    });

    it("rethrows RepositoryError with context", async () => {
      const repoError = new RepositoryError("db failure");
      repoGetPermissionsByRole.mockRejectedValue(repoError);

      await expect(
        service.getPermissionsByRole("role-1"),
      ).rejects.toBeInstanceOf(RepositoryError);
    });

    it("wraps unknown errors as ServiceError", async () => {
      const unknownError = new Error("Cannot read property 'map' of undefined");
      repoGetPermissionsByRole.mockRejectedValue(unknownError);

      await expect(
        service.getPermissionsByRole("role-1"),
      ).rejects.toBeInstanceOf(ServiceError);
    });
  });

  describe("assignPermissionToRole", () => {
    it("assigns permission to role on success", async () => {
      repoAssignPermissionToRole.mockResolvedValue(permissionFixture);

      const result = await service.assignPermissionToRole("role-1", {
        resource: "posts",
        action: "read",
      });

      expect(result).toEqual(permissionFixture);
      expect(repoAssignPermissionToRole).toHaveBeenCalledWith("role-1", {
        resource: "posts",
        action: "read",
      });
    });

    it("rethrows NotFoundError if role not found", async () => {
      const notFoundError = new NotFoundError("Role not found");
      repoAssignPermissionToRole.mockRejectedValue(notFoundError);

      await expect(
        service.assignPermissionToRole("role-1", {
          resource: "posts",
          action: "read",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("rethrows RepositoryError if permission already exists", async () => {
      const repoError = new RepositoryError(
        "Permission already assigned to role",
      );
      repoAssignPermissionToRole.mockRejectedValue(repoError);

      await expect(
        service.assignPermissionToRole("role-1", {
          resource: "posts",
          action: "read",
        }),
      ).rejects.toBeInstanceOf(RepositoryError);
    });

    it("wraps unknown errors as ServiceError", async () => {
      const unknownError = new Error("Unexpected error");
      repoAssignPermissionToRole.mockRejectedValue(unknownError);

      await expect(
        service.assignPermissionToRole("role-1", {
          resource: "posts",
          action: "read",
        }),
      ).rejects.toBeInstanceOf(ServiceError);
    });
  });
});
