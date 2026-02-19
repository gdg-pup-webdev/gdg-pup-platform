/**
 * User repository unit tests.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DatabaseError } from "../../../../errors/DatabaseError.js";
import {
  userAggregateFixture,
  userFixture,
} from "../../__tests__/test-helpers.js";
import { UserRepository } from "../user.repository.js";

const { fromMock } = vi.hoisted(() => ({ fromMock: vi.fn() }));

vi.mock("../../../../lib/supabase.js", () => ({
  supabase: { from: fromMock },
}));

describe("user.repository (unit)", () => {
  const repository = new UserRepository();

  beforeEach(() => {
    fromMock.mockReset();
  });

  it("listUsers selects from user", async () => {
    const selectMock = vi.fn().mockResolvedValue({ data: [userFixture], error: null });

    fromMock.mockReturnValue({ select: selectMock });

    const result = await repository.listUsers();

    expect(fromMock).toHaveBeenCalledWith("user");
    expect(selectMock).toHaveBeenCalledWith("*");
    expect(result).toHaveLength(1);
  });

  it("getUserById filters by id and returns a single row", async () => {
    const singleMock = vi.fn().mockResolvedValue({ data: userFixture, error: null });
    const eqMock = vi.fn().mockReturnValue({ single: singleMock });
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock });

    fromMock.mockReturnValue({ select: selectMock });

    const result = await repository.getUserById(userFixture.id);

    expect(eqMock).toHaveBeenCalledWith("id", userFixture.id);
    expect(result.id).toBe(userFixture.id);
  });

  it("getUserAggregate selects joined resources", async () => {
    const singleMock = vi.fn().mockResolvedValue({ data: userAggregateFixture, error: null });
    const eqMock = vi.fn().mockReturnValue({ single: singleMock });
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock });

    fromMock.mockReturnValue({ select: selectMock });

    const result = await repository.getUserAggregate(userFixture.id);

    expect(selectMock).toHaveBeenCalledWith(
      "*, wallet(*), user_profile(*), user_project(*), user_achievement(*), user_certificate(*), user_settings(*)",
    );
    expect(eqMock).toHaveBeenCalledWith("id", userFixture.id);
    expect(result.wallet).toHaveLength(1);
  });

  it("maps supabase errors to DatabaseError", async () => {
    const selectMock = vi.fn().mockResolvedValue({ data: null, error: { message: "db failure" } });

    fromMock.mockReturnValue({ select: selectMock });

    await expect(repository.listUsers()).rejects.toBeInstanceOf(DatabaseError);
  });
});
