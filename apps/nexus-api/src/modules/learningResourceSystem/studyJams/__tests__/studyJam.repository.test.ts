/**
 * Study jam repository unit tests.
 *
 * Supabase is mocked to assert pagination and filter query construction
 * without touching the real database.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
 
import { studyJamFixture } from "../../__tests__/test-helpers.js";
import { StudyJamRepository } from "../studyJam.repository.js";
import { ServerError } from "@/errors/ServerError.js";

const { fromMock } = vi.hoisted(() => ({
  fromMock: vi.fn(),
}));

vi.mock("../../../../lib/supabase.js", () => ({
  supabase: {
    from: fromMock,
  },
}));

const buildListQueryChain = (result: {
  data: unknown[];
  count: number | null;
  error: { message: string } | null;
}) => {
  const query = {
    or: vi.fn(),
    gte: vi.fn(),
    lte: vi.fn(),
    order: vi.fn(),
    range: vi.fn(),
  };

  query.or.mockReturnValue(query);
  query.gte.mockReturnValue(query);
  query.lte.mockReturnValue(query);
  query.order.mockReturnValue(query);
  query.range.mockResolvedValue(result);

  const selectMock = vi.fn().mockReturnValue(query);

  return { query, selectMock };
};

describe("studyJam.repository (unit)", () => {
  const repository = new StudyJamRepository();

  beforeEach(() => {
    fromMock.mockReset();
  });

  it("create inserts into study_jam and returns the row", async () => {
    const singleMock = vi.fn().mockResolvedValue({
      data: studyJamFixture,
      error: null,
    });
    const selectMock = vi.fn().mockReturnValue({ single: singleMock });
    const insertMock = vi.fn().mockReturnValue({ select: selectMock });

    fromMock.mockReturnValue({ insert: insertMock });

    const result = await repository.create({ title: "t" } as any);

    expect(fromMock).toHaveBeenCalledWith("study_jam");
    expect(insertMock).toHaveBeenCalledTimes(1);
    expect(result.id).toBe(studyJamFixture.id);
  });

  it("list applies deterministic order/range and returns filtered count", async () => {
    const { query, selectMock } = buildListQueryChain({
      data: [studyJamFixture],
      count: 6,
      error: null,
    });

    fromMock.mockReturnValue({ select: selectMock });

    const result = await repository.list(2, 3, {});

    expect(fromMock).toHaveBeenCalledTimes(1);
    expect(fromMock).toHaveBeenCalledWith("study_jam");
    expect(selectMock).toHaveBeenCalledWith("*", { count: "exact" });
    expect(query.order).toHaveBeenCalledWith("created_at", {
      ascending: false,
    });
    expect(query.range).toHaveBeenCalledWith(3, 5);
    expect(result.count).toBe(6);
    expect(result.list).toHaveLength(1);
  });

  it("list applies combined search and date filters", async () => {
    const { query, selectMock } = buildListQueryChain({
      data: [studyJamFixture],
      count: 1,
      error: null,
    });

    fromMock.mockReturnValue({ select: selectMock });

    await repository.list(1, 10, {
      search: "typescript",
      createdFrom: "2026-01-01T00:00:00.000Z",
      createdTo: "2026-01-31T23:59:59.999Z",
    });

    expect(query.or).toHaveBeenCalledWith(
      "title.ilike.%typescript%,summary.ilike.%typescript%,description.ilike.%typescript%",
    );
    expect(query.gte).toHaveBeenCalledWith(
      "created_at",
      "2026-01-01T00:00:00.000Z",
    );
    expect(query.lte).toHaveBeenCalledWith(
      "created_at",
      "2026-01-31T23:59:59.999Z",
    );
  });

  it("list handles empty results with filtered count", async () => {
    const { selectMock } = buildListQueryChain({
      data: [],
      count: 0,
      error: null,
    });

    fromMock.mockReturnValue({ select: selectMock });

    const result = await repository.list(1, 10, { search: "missing" });

    expect(result).toEqual({
      list: [],
      count: 0,
    });
  });

  it("maps list query failures to DatabaseError", async () => {
    const { selectMock } = buildListQueryChain({
      data: [],
      count: null,
      error: { message: "list failed" },
    });

    fromMock.mockReturnValue({ select: selectMock });

    await expect(repository.list(1, 10, {})).rejects.toBeInstanceOf(
      ServerError,
    );
  });

  it("maps supabase insert errors to DatabaseError", async () => {
    const singleMock = vi.fn().mockResolvedValue({
      data: null,
      error: { message: "insert failed" },
    });
    const selectMock = vi.fn().mockReturnValue({ single: singleMock });
    const insertMock = vi.fn().mockReturnValue({ select: selectMock });

    fromMock.mockReturnValue({ insert: insertMock });

    await expect(repository.create({} as any)).rejects.toBeInstanceOf(
      ServerError,
    );
  });
});
