/**
 * Member repository unit tests.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
 
import { memberFixture } from "../../__tests__/test-helpers.js";
import { MemberRepository } from "../member.repository.js";
import { ServerError } from "@/errors/ServerError.js";

const { fromMock } = vi.hoisted(() => ({ fromMock: vi.fn() }));

vi.mock("../../../../lib/supabase.js", () => ({
  supabase: { from: fromMock },
}));

describe("member.repository (unit)", () => {
  const repository = new MemberRepository();

  beforeEach(() => {
    fromMock.mockReset();
  });

  it("listMembersWithFilter applies filters, ordering, and pagination", async () => {
    const rangeMock = vi.fn().mockResolvedValue({
      data: [memberFixture],
      count: 1,
      error: null,
    });
    const orderMock = vi.fn().mockReturnValue({ range: rangeMock });
    const query: any = { order: orderMock };
    const eqMock = vi.fn().mockImplementation(() => query);
    query.eq = eqMock;
    const selectMock = vi.fn().mockReturnValue(query);

    fromMock.mockReturnValue({ select: selectMock });

    const result = await repository.listMembersWithFilter(1, 10, {
      teamId: memberFixture.team_id,
    });

    expect(fromMock).toHaveBeenCalledWith("team_member");
    expect(selectMock).toHaveBeenCalledWith("*", { count: "exact" });
    expect(eqMock).toHaveBeenCalledWith("team_id", memberFixture.team_id);
    expect(orderMock).toHaveBeenCalledWith("role", { ascending: true });
    expect(rangeMock).toHaveBeenCalledWith(0, 9);
    expect(result.count).toBe(1);
  });

  it("maps supabase errors to DatabaseError", async () => {
    const rangeMock = vi.fn().mockResolvedValue({
      data: null,
      count: null,
      error: { message: "db failure" },
    });
    const orderMock = vi.fn().mockReturnValue({ range: rangeMock });
    const query: any = { order: orderMock };
    const eqMock = vi.fn().mockImplementation(() => query);
    query.eq = eqMock;
    const selectMock = vi.fn().mockReturnValue(query);

    fromMock.mockReturnValue({ select: selectMock });

    await expect(repository.listMembersWithFilter(1, 10, {})).rejects.toBeInstanceOf(
      ServerError,
    );
  });
});
