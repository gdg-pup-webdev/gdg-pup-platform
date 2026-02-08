/**
 * External resource repository unit tests.
 *
 * Supabase is mocked to assert query structure and filter branching while
 * keeping tests database-free.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DatabaseError } from "../../../../classes/ServerError.js";
import { externalResourceFixture } from "../../__tests__/test-helpers.js";
import { ExternalResourceRepository } from "../externalResource.repository.js";

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
    eq: vi.fn(),
    in: vi.fn(),
    order: vi.fn(),
    range: vi.fn(),
  };

  query.or.mockReturnValue(query);
  query.gte.mockReturnValue(query);
  query.lte.mockReturnValue(query);
  query.eq.mockReturnValue(query);
  query.in.mockReturnValue(query);
  query.order.mockReturnValue(query);
  query.range.mockResolvedValue(result);

  const selectMock = vi.fn().mockReturnValue(query);

  return { query, selectMock };
};

describe("externalResource.repository (unit)", () => {
  const repository = new ExternalResourceRepository();

  beforeEach(() => {
    fromMock.mockReset();
  });

  it("create inserts into external_resource and returns the row", async () => {
    const singleMock = vi.fn().mockResolvedValue({
      data: externalResourceFixture,
      error: null,
    });
    const selectMock = vi.fn().mockReturnValue({ single: singleMock });
    const insertMock = vi.fn().mockReturnValue({ select: selectMock });

    fromMock.mockReturnValue({ insert: insertMock });

    const result = await repository.create({ title: "t" } as any);

    expect(fromMock).toHaveBeenCalledWith("external_resource");
    expect(insertMock).toHaveBeenCalledTimes(1);
    expect(result.id).toBe(externalResourceFixture.id);
  });

  it("list applies deterministic order/range and returns filtered count", async () => {
    const { query, selectMock } = buildListQueryChain({
      data: [externalResourceFixture],
      count: 7,
      error: null,
    });

    fromMock.mockReturnValue({ select: selectMock });

    const result = await repository.list(2, 2, {});

    expect(fromMock).toHaveBeenCalledTimes(1);
    expect(fromMock).toHaveBeenCalledWith("external_resource");
    expect(selectMock).toHaveBeenCalledWith("*", { count: "exact" });
    expect(query.order).toHaveBeenCalledWith("created_at", {
      ascending: false,
    });
    expect(query.range).toHaveBeenCalledWith(2, 3);
    expect(result.count).toBe(7);
    expect(result.list).toHaveLength(1);
  });

  it("list applies search/date/uploader filters when provided", async () => {
    const { query, selectMock } = buildListQueryChain({
      data: [externalResourceFixture],
      count: 1,
      error: null,
    });

    fromMock.mockReturnValue({ select: selectMock });

    await repository.list(1, 10, {
      search: "performance",
      createdFrom: "2026-01-01T00:00:00.000Z",
      createdTo: "2026-01-31T23:59:59.999Z",
      uploaderId: "user-1",
    });

    expect(query.or).toHaveBeenCalledWith(
      "title.ilike.%performance%,description.ilike.%performance%",
    );
    expect(query.gte).toHaveBeenCalledWith(
      "created_at",
      "2026-01-01T00:00:00.000Z",
    );
    expect(query.lte).toHaveBeenCalledWith(
      "created_at",
      "2026-01-31T23:59:59.999Z",
    );
    expect(query.eq).toHaveBeenCalledWith("uploader_id", "user-1");
  });

  it("list applies tag filter via resource_tag_junction and uses match-any ids", async () => {
    const { query, selectMock } = buildListQueryChain({
      data: [externalResourceFixture],
      count: 1,
      error: null,
    });

    const lookupInMock = vi.fn().mockResolvedValue({
      data: [
        { resource_id: externalResourceFixture.id },
        { resource_id: externalResourceFixture.id },
      ],
      error: null,
    });
    const lookupSelectMock = vi.fn().mockReturnValue({ in: lookupInMock });

    fromMock
      .mockReturnValueOnce({ select: selectMock })
      .mockReturnValueOnce({ select: lookupSelectMock });

    await repository.list(1, 10, { tagIds: ["tag-1", "tag-2"] });

    expect(fromMock).toHaveBeenNthCalledWith(1, "external_resource");
    expect(fromMock).toHaveBeenNthCalledWith(2, "resource_tag_junction");
    expect(lookupSelectMock).toHaveBeenCalledWith("resource_id");
    expect(lookupInMock).toHaveBeenCalledWith("resource_tag_id", [
      "tag-1",
      "tag-2",
    ]);
    expect(query.in).toHaveBeenCalledWith("id", [externalResourceFixture.id]);
  });

  it("list returns empty result when tag lookup finds no matching resources", async () => {
    const { query, selectMock } = buildListQueryChain({
      data: [externalResourceFixture],
      count: 1,
      error: null,
    });

    const lookupInMock = vi.fn().mockResolvedValue({
      data: [],
      error: null,
    });
    const lookupSelectMock = vi.fn().mockReturnValue({ in: lookupInMock });

    fromMock
      .mockReturnValueOnce({ select: selectMock })
      .mockReturnValueOnce({ select: lookupSelectMock });

    const result = await repository.list(1, 10, { tagIds: ["tag-1"] });

    expect(result).toEqual({
      list: [],
      count: 0,
    });
    expect(query.order).not.toHaveBeenCalled();
    expect(query.range).not.toHaveBeenCalled();
  });

  it("maps list query failures to DatabaseError", async () => {
    const { selectMock } = buildListQueryChain({
      data: [],
      count: null,
      error: { message: "list failed" },
    });

    fromMock.mockReturnValue({ select: selectMock });

    await expect(repository.list(1, 10, {})).rejects.toBeInstanceOf(
      DatabaseError,
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
      DatabaseError,
    );
  });
});
