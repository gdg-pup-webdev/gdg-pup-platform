/** Role service unit tests. */
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  DatabaseError,
  RepositoryError,
} from "../../../../classes/ServerError.js";
import { listResult, roleFixture } from "../../__tests__/test-helpers.js";
import { RoleService } from "../role.service.js";

const { repoGetRolesOfUser } = vi.hoisted(() => ({
  repoGetRolesOfUser: vi.fn(),
}));

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
    repoGetRolesOfUser.mockResolvedValue(listResult([roleFixture]));
    const result = await service.getRolesOfUser("user-1");
    expect(repoGetRolesOfUser).toHaveBeenCalledWith("user-1");
    expect(result.count).toBe(1);
    expect(result.list).toEqual([roleFixture]);
  });

  it("returns empty list if user has no roles", async () => {
    repoGetRolesOfUser.mockResolvedValue(listResult([]));
    const result = await service.getRolesOfUser("user-2");
    expect(result.count).toBe(0);
    expect(result.list).toEqual([]);
  });

  it("maps repository errors to RepositoryError-shaped failures", async () => {
    repoGetRolesOfUser.mockRejectedValue(new DatabaseError("db failure"));
    await expect(service.getRolesOfUser("user-1")).rejects.toBeInstanceOf(
      RepositoryError,
    );
  });

  it("supports pagination parameters", async () => {});
});
