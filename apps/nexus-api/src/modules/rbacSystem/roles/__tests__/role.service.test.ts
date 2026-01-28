/**
 * Role service unit tests.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DatabaseError } from "../../../../classes/ServerError.js";
import { listResult, roleFixture } from "../../__tests__/test-helpers.js";
import { RoleService } from "../role.service.js";

const { repoGetRolesOfUser } = vi.hoisted(() => ({ repoGetRolesOfUser: vi.fn() }));

vi.mock("../role.repository.js", () => ({
  roleRepositoryInstance: {
    getRolesOfUser: repoGetRolesOfUser,
  },
  RoleRepository: class {},
}));

describe("role.service (unit)", () => {
  const service = new RoleService();

  beforeEach(() => {
    repoGetRolesOfUser.mockReset();
  });

  it("returns the repository result on success", async () => {
    repoGetRolesOfUser.mockResolvedValue(listResult(roleFixture));

    const result = await service.getRolesOfUser("user-1");

    expect(repoGetRolesOfUser).toHaveBeenCalledWith("user-1");
    expect(result.count).toBe(1);
  });

  it("maps repository errors to RepositoryError-shaped failures", async () => {
    repoGetRolesOfUser.mockRejectedValue(new DatabaseError("db failure"));

    await expect(service.getRolesOfUser("user-1")).rejects.toMatchObject({
      title: "Database Error",
      statusCode: 500,
    });
  });
});
