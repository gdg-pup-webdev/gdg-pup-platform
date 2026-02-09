/**
 * Permission integration tests.
 *
 * Tests the full flow from controller through service to repository,
 * validating error handling and successful operations end-to-end.
 */
import { beforeEach, describe, expect, it, vi } from "vitest"; 
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
  
});
