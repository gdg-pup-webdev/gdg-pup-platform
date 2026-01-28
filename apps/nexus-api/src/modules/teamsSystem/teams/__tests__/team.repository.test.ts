/**
 * Team repository unit tests.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DatabaseError } from "../../../../classes/ServerError.js";
import { teamFixture } from "../../__tests__/test-helpers.js";
import { TeamRepository } from "../team.repository.js";

const { fromMock } = vi.hoisted(() => ({ fromMock: vi.fn() }));

vi.mock("../../../../lib/supabase.js", () => ({
  supabase: { from: fromMock },
}));

describe("team.repository (unit)", () => {
  const repository = new TeamRepository();

  beforeEach(() => {
    fromMock.mockReset();
  });

  it("createTeam inserts into team and returns the row", async () => {
    const singleMock = vi.fn().mockResolvedValue({ data: teamFixture, error: null });
    const selectMock = vi.fn().mockReturnValue({ single: singleMock });
    const insertMock = vi.fn().mockReturnValue({ select: selectMock });

    fromMock.mockReturnValue({ insert: insertMock });

    const result = await repository.createTeam(teamFixture as any);

    expect(fromMock).toHaveBeenCalledWith("team");
    expect(result.id).toBe(teamFixture.id);
  });

  it("listTeams orders by name and returns list + count", async () => {
    const orderMock = vi.fn().mockResolvedValue({ data: [teamFixture], error: null });
    const selectListMock = vi.fn().mockReturnValue({ order: orderMock });

    const selectCountMock = vi.fn().mockResolvedValue({ count: 1, error: null });

    fromMock
      .mockReturnValueOnce({ select: selectListMock })
      .mockReturnValueOnce({ select: selectCountMock });

    const result = await repository.listTeams();

    expect(orderMock).toHaveBeenCalledWith("name", { ascending: false });
    expect(result.count).toBe(1);
  });

  it("maps supabase errors to DatabaseError", async () => {
    const singleMock = vi.fn().mockResolvedValue({ data: null, error: { message: "db failure" } });
    const selectMock = vi.fn().mockReturnValue({ single: singleMock });
    const insertMock = vi.fn().mockReturnValue({ select: selectMock });

    fromMock.mockReturnValue({ insert: insertMock });

    await expect(repository.createTeam({} as any)).rejects.toBeInstanceOf(DatabaseError);
  });
});
