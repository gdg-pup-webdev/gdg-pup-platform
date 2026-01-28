/**
 * Role repository unit tests.
 *
 * Supabase is mocked to validate query chains and error mapping without
 * touching a real database.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DatabaseError } from "../../../../classes/ServerError.js";
import { roleFixture } from "../../__tests__/test-helpers.js";
import { RoleRepository } from "../role.repository.js";

const { fromMock } = vi.hoisted(() => ({ fromMock: vi.fn() }));

vi.mock("../../../../lib/supabase.js", () => ({
  supabase: { from: fromMock },
}));

describe("role.repository (unit)", () => {
  const repository = new RoleRepository();

  beforeEach(() => {
    fromMock.mockReset();
  });

  it("getRolesOfUser queries the junction table and maps user_role rows", async () => {
    const eqListMock = vi.fn().mockResolvedValue({
      data: [{ user_role: roleFixture }],
      error: null,
    });
    const selectListMock = vi.fn().mockReturnValue({ eq: eqListMock });

    const eqCountMock = vi.fn().mockResolvedValue({ count: 1, error: null });
    const selectCountMock = vi.fn().mockReturnValue({ eq: eqCountMock });

    fromMock
      .mockReturnValueOnce({ select: selectListMock })
      .mockReturnValueOnce({ select: selectCountMock });

    const result = await repository.getRolesOfUser("user-1");

    expect(fromMock).toHaveBeenNthCalledWith(1, "user_role_junction");
    expect(selectListMock).toHaveBeenCalledWith("*, user_role(*)");
    expect(eqListMock).toHaveBeenCalledWith("user_id", "user-1");
    expect(result.list).toEqual([roleFixture]);
    expect(result.count).toBe(1);
  });

  it("maps supabase errors to DatabaseError", async () => {
    const eqListMock = vi.fn().mockResolvedValue({
      data: null,
      error: { message: "db failure" },
    });
    const selectListMock = vi.fn().mockReturnValue({ eq: eqListMock });

    fromMock.mockReturnValue({ select: selectListMock });

    await expect(repository.getRolesOfUser("user-1")).rejects.toBeInstanceOf(
      DatabaseError,
    );
  });
});
