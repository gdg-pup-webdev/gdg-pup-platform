/**
 * User service unit tests.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DatabaseError } from "../../../../classes/ServerError.js";
import {
  userAggregateFixture,
  userFixture,
} from "../../__tests__/test-helpers.js";
import { UserService } from "../user.service.js";

const { repoList, repoGet, repoAggregate } = vi.hoisted(() => ({
  repoList: vi.fn(),
  repoGet: vi.fn(),
  repoAggregate: vi.fn(),
}));

vi.mock("../user.repository.js", () => ({
  userRepositoryInstance: {
    listUsers: repoList,
    getUserById: repoGet,
    getUserAggregate: repoAggregate,
  },
  UserRepository: class {},
}));

describe("user.service (unit)", () => {
  const service = new UserService();

  beforeEach(() => {
    repoList.mockReset();
    repoGet.mockReset();
    repoAggregate.mockReset();
  });

  it("listUsers delegates to the repository", async () => {
    repoList.mockResolvedValue([userFixture]);

    const result = await service.listUsers();

    expect(repoList).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(1);
  });

  it("getUserById delegates to the repository", async () => {
    repoGet.mockResolvedValue(userFixture);

    const result = await service.getUserById(userFixture.id);

    expect(repoGet).toHaveBeenCalledWith(userFixture.id);
    expect(result.id).toBe(userFixture.id);
  });

  it("getUserAggregate delegates to the repository", async () => {
    repoAggregate.mockResolvedValue(userAggregateFixture);

    const result = await service.getUserAggregate(userFixture.id);

    expect(repoAggregate).toHaveBeenCalledWith(userFixture.id);
    expect(result.wallet).toHaveLength(1);
  });

  it("maps repository errors to RepositoryError-shaped failures", async () => {
    repoList.mockRejectedValue(new DatabaseError("db failure"));

    await expect(service.listUsers()).rejects.toMatchObject({
      title: "Database Error",
      statusCode: 500,
    });
  });
});
