/** Role service unit tests. */
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  RepositoryError,
  ServiceError,
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

  it("rethrows known repository errors with context", async () => {
    const repoError = new RepositoryError("db failure");
    repoGetRolesOfUser.mockRejectedValue(repoError);

    await expect(service.getRolesOfUser("user-1")).rejects.toThrow(
      RepositoryError,
    );
  });

  it("wraps unknown errors (syntax errors, etc.) as ServiceError", async () => {
    // Simulate a syntax error or unexpected error from repository
    const unknownError = new Error("Cannot read property 'map' of undefined");
    repoGetRolesOfUser.mockRejectedValue(unknownError);

    await expect(service.getRolesOfUser("user-1")).rejects.toBeInstanceOf(
      ServiceError,
    );
  });

  it("supports pagination parameters", async () => {
    // TODO: implement pagination test
  });
});
