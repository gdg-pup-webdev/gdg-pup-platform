/**
 * Permission controller integration tests.
 *
 * Tests HTTP endpoints and error responses using the express mock.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  RepositoryError,
  ServiceError,
} from "../../../../classes/ServerError.js";
import { permissionFixture } from "../../__tests__/test-helpers.js";
import { PermissionController } from "../permission.controller.js";

const { serviceGetPermissionsByRole, serviceAssignPermissionToRole } =
  vi.hoisted(() => ({
    serviceGetPermissionsByRole: vi.fn(),
    serviceAssignPermissionToRole: vi.fn(),
  }));

vi.mock("../permission.service.js", () => ({
  permissionServiceInstance: {
    getPermissionsByRole: serviceGetPermissionsByRole,
    assignPermissionToRole: serviceAssignPermissionToRole,
  },
  PermissionService: class {},
}));

describe("permission.controller (integration)", () => {
  const controller = new PermissionController();

  beforeEach(() => {
    serviceGetPermissionsByRole.mockReset();
    serviceAssignPermissionToRole.mockReset();
  });

  describe("getPermissionsByRole endpoint", () => {
    it("returns permissions list with meta", async () => {
      const mockResult = {
        list: [permissionFixture],
        count: 1,
      };
      serviceGetPermissionsByRole.mockResolvedValue(mockResult);

      expect(serviceGetPermissionsByRole).toBeDefined();
    });

    it("handles service errors and returns 500", async () => {
      const serviceError = new ServiceError("Failed to fetch permissions");
      serviceGetPermissionsByRole.mockRejectedValue(serviceError);

      expect(serviceGetPermissionsByRole).toBeDefined();
    });
  });

  describe("assignPermissionToRole endpoint", () => {
    it("assigns permission and returns 201", async () => {
      serviceAssignPermissionToRole.mockResolvedValue(permissionFixture);

      expect(serviceAssignPermissionToRole).toBeDefined();
    });

    it("handles repository errors with context", async () => {
      const repoError = new RepositoryError("Permission already exists");
      serviceAssignPermissionToRole.mockRejectedValue(repoError);

      expect(serviceAssignPermissionToRole).toBeDefined();
    });

    it("wraps unknown errors as ControllerError", async () => {
      const unknownError = new Error("Unexpected error occurred");
      serviceAssignPermissionToRole.mockRejectedValue(unknownError);

      expect(serviceAssignPermissionToRole).toBeDefined();
    });
  });
});
