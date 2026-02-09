// /**
//  * Permission repository unit tests.
//  *
//  * Supabase is mocked to validate query chains and error mapping without
//  * touching a real database.
//  */
// import { beforeEach, describe, expect, it, vi } from "vitest"; 
// import { permissionFixture } from "../../__tests__/test-helpers.js";
// import { PermissionRepository } from "../permission.repository.js";

// const { fromMock } = vi.hoisted(() => ({ fromMock: vi.fn() }));

// vi.mock("@/configs/configs", () => ({
//   configs: {
//     supabaseUrl: "http://localhost",
//     supabaseKey: "test-key",
//   },
// }));

// vi.mock("@/lib/supabase", () => {
//   return {
//     supabase: {
//       from: fromMock,
//     },
//   };
// });

// describe("permission.repository (unit)", () => {
//   const repository = new PermissionRepository();

//   beforeEach(() => {
//     fromMock.mockReset();
//   });

//   describe("getPermissionsByRole", () => {
//     it("queries the permission table and returns permissions for role", async () => {
//       const mockData = [permissionFixture];

//       // First query: get permissions
//       const eqMock = vi.fn().mockResolvedValue({
//         data: mockData,
//         error: null,
//       });
//       const selectMock = vi.fn().mockReturnValue({ eq: eqMock });

//       // Second query: get count
//       const eqCountMock = vi.fn().mockResolvedValue({
//         data: mockData,
//         count: 1,
//         error: null,
//       });
//       const selectCountMock = vi.fn().mockReturnValue({ eq: eqCountMock });

//       fromMock
//         .mockReturnValueOnce({ select: selectMock })
//         .mockReturnValueOnce({ select: selectCountMock });

//       const result = await repository.getPermissionsByRole("role-1");

//       expect(result.list).toEqual(mockData);
//       expect(result.count).toBe(1);
//     });

//     it("returns empty list if role has no permissions", async () => {
//       const eqMock = vi.fn().mockResolvedValue({
//         data: [],
//         error: null,
//       });
//       const selectMock = vi.fn().mockReturnValue({ eq: eqMock });

//       const eqCountMock = vi.fn().mockResolvedValue({
//         data: [],
//         count: 0,
//         error: null,
//       });
//       const selectCountMock = vi.fn().mockReturnValue({ eq: eqCountMock });

//       fromMock
//         .mockReturnValueOnce({ select: selectMock })
//         .mockReturnValueOnce({ select: selectCountMock });

//       const result = await repository.getPermissionsByRole("role-2");

//       expect(result.list).toEqual([]);
//       expect(result.count).toBe(0);
//     });

//     it("throws DatabaseError on database error", async () => {
//       const eqMock = vi.fn().mockResolvedValue({
//         data: null,
//         error: { message: "database error" },
//       });
//       const selectMock = vi.fn().mockReturnValue({ eq: eqMock });

//       fromMock.mockReturnValue({ select: selectMock });

//       await expect(
//         repository.getPermissionsByRole("role-1"),
//       ).rejects.toBeInstanceOf(DatabaseError);
//     });
//   });

//   describe("getPermissionByUserId", () => {
//     it("fetches user roles then their permissions", async () => {
//       // First query: get role IDs for user
//       const eqJunctionMock = vi.fn().mockResolvedValue({
//         data: [{ role_id: "role-1" }, { role_id: "role-2" }],
//         error: null,
//       });
//       const selectJunctionMock = vi
//         .fn()
//         .mockReturnValue({ eq: eqJunctionMock });

//       // Second query: get permissions for those roles
//       const inPermissionMock = vi.fn().mockResolvedValue({
//         data: [permissionFixture],
//         error: null,
//       });
//       const selectPermissionMock = vi
//         .fn()
//         .mockReturnValue({ in: inPermissionMock });

//       // Third query: get count
//       const inCountMock = vi.fn().mockResolvedValue({
//         data: [permissionFixture],
//         count: 1,
//         error: null,
//       });
//       const selectCountMock = vi.fn().mockReturnValue({ in: inCountMock });

//       fromMock
//         .mockReturnValueOnce({ select: selectJunctionMock })
//         .mockReturnValueOnce({ select: selectPermissionMock })
//         .mockReturnValueOnce({ select: selectCountMock });

//       const result = await repository.getPermissionByUserId("user-1");

//       expect(result.list).toEqual([permissionFixture]);
//       expect(result.count).toBe(1);
//     });

//     it("returns empty list if user has no roles", async () => {
//       const eqJunctionMock = vi.fn().mockResolvedValue({
//         data: [],
//         error: null,
//       });
//       const selectJunctionMock = vi
//         .fn()
//         .mockReturnValue({ eq: eqJunctionMock });

//       fromMock.mockReturnValue({ select: selectJunctionMock });

//       const result = await repository.getPermissionByUserId("user-2");

//       expect(result.list).toEqual([]);
//       expect(result.count).toBe(0);
//     });

//     it("throws DatabaseError on junction query error", async () => {
//       const eqJunctionMock = vi.fn().mockResolvedValue({
//         data: null,
//         error: { message: "database error" },
//       });
//       const selectJunctionMock = vi
//         .fn()
//         .mockReturnValue({ eq: eqJunctionMock });

//       fromMock.mockReturnValue({ select: selectJunctionMock });

//       await expect(
//         repository.getPermissionByUserId("user-1"),
//       ).rejects.toBeInstanceOf(DatabaseError);
//     });
//   });

//   describe("assignPermissionToRole", () => {
//     it("inserts permission and returns it", async () => {
//       const singleMock = vi.fn().mockResolvedValue({
//         data: permissionFixture,
//         error: null,
//       });
//       const selectMock = vi.fn().mockReturnValue({ single: singleMock });
//       const insertMock = vi.fn().mockReturnValue({ select: selectMock });

//       fromMock.mockReturnValue({ insert: insertMock });

//       const result = await repository.assignPermissionToRole("role-1", {
//         resource: "posts",
//         action: "read",
//       });

//       expect(result).toEqual(permissionFixture);
//     });

//     it("throws RepositoryError on duplicate permission (error code 23505)", async () => {
//       const singleMock = vi.fn().mockResolvedValue({
//         data: null,
//         error: { code: "23505", message: "duplicate key" },
//       });
//       const selectMock = vi.fn().mockReturnValue({ single: singleMock });
//       const insertMock = vi.fn().mockReturnValue({ select: selectMock });

//       fromMock.mockReturnValue({ insert: insertMock });

//       await expect(
//         repository.assignPermissionToRole("role-1", {
//           resource: "posts",
//           action: "read",
//         }),
//       ).rejects.toBeInstanceOf(RepositoryError);
//     });

//     it("throws NotFoundError when role not found (error code PGRST116)", async () => {
//       const singleMock = vi.fn().mockResolvedValue({
//         data: null,
//         error: { code: "PGRST116", message: "no rows" },
//       });
//       const selectMock = vi.fn().mockReturnValue({ single: singleMock });
//       const insertMock = vi.fn().mockReturnValue({ select: selectMock });

//       fromMock.mockReturnValue({ insert: insertMock });

//       await expect(
//         repository.assignPermissionToRole("role-1", {
//           resource: "posts",
//           action: "read",
//         }),
//       ).rejects.toBeInstanceOf(NotFoundError);
//     });
//   });

//   describe("assignPermissionsToRoleInBulk", () => {
//     it("inserts multiple permissions and returns them", async () => {
//       const permissions = [permissionFixture, permissionFixture];
//       const selectMock = vi.fn().mockResolvedValue({
//         data: permissions,
//         error: null,
//       });
//       const insertMock = vi.fn().mockReturnValue({ select: selectMock });

//       fromMock.mockReturnValue({ insert: insertMock });

//       const result = await repository.assignPermissionsToRoleInBulk("role-1", [
//         { resource: "posts", action: "read" },
//         { resource: "users", action: "read" },
//       ]);

//       expect(result).toEqual(permissions);
//     });

//     it("returns empty array if no permissions provided", async () => {
//       const result = await repository.assignPermissionsToRoleInBulk(
//         "role-1",
//         [],
//       );

//       expect(result).toEqual([]);
//     });
//   });

//   describe("removePermissionFromRole", () => {
//     it("deletes permission from role successfully", async () => {
//       // First .eq() call for id
//       const eqMock2 = vi.fn().mockResolvedValue({
//         error: null,
//       });

//       // Second .eq() call for user_role_id
//       const eqMock1 = vi.fn().mockReturnValue({ eq: eqMock2 });

//       const deleteMock = vi.fn().mockReturnValue({ eq: eqMock1 });

//       fromMock.mockReturnValue({ delete: deleteMock });

//       const result = await repository.removePermissionFromRole(
//         "role-1",
//         "perm-1",
//       );

//       expect(result.success).toBe(true);
//     });

//     it("throws DatabaseError on delete failure", async () => {
//       const eqMock2 = vi.fn().mockResolvedValue({
//         error: { message: "database error" },
//       });

//       const eqMock1 = vi.fn().mockReturnValue({ eq: eqMock2 });

//       const deleteMock = vi.fn().mockReturnValue({ eq: eqMock1 });

//       fromMock.mockReturnValue({ delete: deleteMock });

//       await expect(
//         repository.removePermissionFromRole("role-1", "perm-1"),
//       ).rejects.toBeInstanceOf(DatabaseError);
//     });
//   });

//   describe("removePermissionsFromRoleInBulk", () => {
//     it("deletes multiple permissions from role", async () => {
//       const inMock = vi.fn().mockResolvedValue({
//         error: null,
//       });
//       const eqMock = vi.fn().mockReturnValue({ in: inMock });
//       const deleteMock = vi.fn().mockReturnValue({ eq: eqMock });

//       fromMock.mockReturnValue({ delete: deleteMock });

//       const result = await repository.removePermissionsFromRoleInBulk(
//         "role-1",
//         ["perm-1", "perm-2"],
//       );

//       expect(result.success).toBe(true);
//     });

//     it("returns success true if no permissions provided", async () => {
//       const result = await repository.removePermissionsFromRoleInBulk(
//         "role-1",
//         [],
//       );

//       expect(result.success).toBe(true);
//     });
//   });
// });
