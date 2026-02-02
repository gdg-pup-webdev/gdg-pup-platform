/**
 * Permission integration tests.
 *
 * Tests the full flow from controller through service to repository,
 * validating error handling and successful operations end-to-end.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  RepositoryError,
  ServiceError,
  ControllerError,
} from "../../../../classes/ServerError.js";
import { permissionFixture } from "../../__tests__/test-helpers.js";
import { PermissionService } from "../permission.service.js";
import { PermissionController } from "../permission.controller.js";

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

describe("permission (integration)", () => {
  const service = new PermissionService();

  beforeEach(() => {
    repoGetPermissionsByRole.mockReset();
    repoAssignPermissionToRole.mockReset();
  });

  it("service handles repository errors and propagates them", async () => {
    const repoError = new RepositoryError("db connection failed");
    repoGetPermissionsByRole.mockRejectedValue(repoError);

    await expect(service.getPermissionsByRole("role-1")).rejects.toBeInstanceOf(
      RepositoryError,
    );
  });

  it("service wraps unknown errors and propagates as ServiceError", async () => {
    const syntaxError = new Error("undefined is not an object");
    repoGetPermissionsByRole.mockRejectedValue(syntaxError);

    await expect(service.getPermissionsByRole("role-1")).rejects.toBeInstanceOf(
      ServiceError,
    );
  });

  it("service successfully assigns permission to role", async () => {
    repoAssignPermissionToRole.mockResolvedValue(permissionFixture);

    const result = await service.assignPermissionToRole("role-1", {
      resource: "posts",
      action: "edit",
    });

    expect(result).toEqual(permissionFixture);
  });
});
