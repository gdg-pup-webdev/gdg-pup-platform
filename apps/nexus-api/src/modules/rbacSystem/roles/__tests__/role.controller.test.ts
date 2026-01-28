/**
 * Role controller integration tests.
 *
 * These tests hit the real Express app but mock the service layer to
 * validate routing, contract shape, and pagination meta.
 */
import request = require("supertest");
import { beforeEach, describe, expect, it, vi } from "vitest";

import app from "../../../../app.js";
import {
  listResult,
  rbacPagination,
  roleFixture,
} from "../../__tests__/test-helpers.js";

const rolesBasePath = "/api/rbac-system/roles";

const { roleList } = vi.hoisted(() => ({ roleList: vi.fn() }));

vi.mock("../role.service.js", () => ({
  roleServiceInstance: {
    getRolesOfUser: roleList,
  },
  RoleService: class {},
}));

describe("role.controller (integration)", () => {
  beforeEach(() => {
    roleList.mockReset();
  });

  it("GET /api/rbac-system/roles returns list + meta and calls service with userId", async () => {
    roleList.mockResolvedValue(listResult(roleFixture));

    const response = await request(app)
      .get(rolesBasePath)
      .query({ userId: "user-1", ...rbacPagination });

    expect(response.status).toBe(200);
    expect(roleList).toHaveBeenCalledWith("user-1");
    expect(response.body).toMatchObject({
      status: "success",
      message: "User roles fetched successfully",
      data: [roleFixture],
      meta: {
        totalRecords: 1,
        currentPage: rbacPagination.pageNumber,
        pageSize: rbacPagination.pageSize,
        totalPages: 1,
      },
    });
  });
});
