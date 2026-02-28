// /**
//  * Role controller integration tests.
//  *
//  * These tests hit the real Express app but mock the service layer to
//  * validate routing, contract shape, and pagination meta.
//  */
// import request from "supertest";
// import { beforeEach, describe, expect, it, vi } from "vitest";

// import app from "../../../../app.js";
// import {
//   listResult,
//   rbacPagination,
//   roleFixture,
// } from "../../__tests__/test-helpers.js";

// const rolesBasePath = "/api/rbac-system/roles";

// const { roleList } = vi.hoisted(() => ({ roleList: vi.fn() }));

// vi.mock("../role.service.js", () => ({
//   roleServiceInstance: {
//     getRolesOfUser: roleList,
//   },
//   RoleService: class {},
// }));

// describe("role.controller (integration)", () => {
//   beforeEach(() => {
//     roleList.mockReset();
//   });

//   it("GET /api/rbac-system/roles returns list + meta and calls service with userId", async () => {
//     roleList.mockResolvedValue(listResult([roleFixture]));

//     const response = await request(app)
//       .get(rolesBasePath)
//       .query({ userId: "user-1", ...rbacPagination });

//     expect(response.status).toBe(200);
//     expect(roleList).toHaveBeenCalledWith("user-1");
//     expect(response.body).toMatchObject({
//       status: "success",
//       message: "User roles fetched successfully",
//       data: [roleFixture],
//       meta: {
//         totalRecords: 1,
//         currentPage: rbacPagination.pageNumber,
//         pageSize: rbacPagination.pageSize,
//         totalPages: 1,
//       },
//     });
//   });

//   it("GET /api/rbac-system/roles returns empty list if user has no roles", async () => {
//     roleList.mockResolvedValue(listResult([]));

//     const response = await request(app)
//       .get(rolesBasePath)
//       .query({ userId: "user-2", ...rbacPagination });

//     expect(response.status).toBe(200);
//     expect(roleList).toHaveBeenCalledWith("user-2");
//     expect(response.body.data).toEqual([]);
//     expect(response.body.meta.totalRecords).toBe(0);
//   });

//   it("GET /api/rbac-system/roles handles service errors", async () => {
//     roleList.mockRejectedValue(new Error("Service failure"));

//     const response = await request(app)
//       .get(rolesBasePath)
//       .query({ userId: "user-3", ...rbacPagination });

//     expect(response.status).toBeGreaterThanOrEqual(400);
//     expect(response.body.status).toBe("fail");
//   });

//   it("GET /api/rbac-system/roles returns correct pagination meta", async () => {
//     roleList.mockResolvedValue(listResult([roleFixture, roleFixture]));
//     const response = await request(app)
//       .get(rolesBasePath)
//       .query({ userId: "user-4", ...rbacPagination });

//     expect(response.body.meta.totalRecords).toBe(2);
//     expect(response.body.meta.pageSize).toBe(rbacPagination.pageSize);
//   });
// });
