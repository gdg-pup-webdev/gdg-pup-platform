/**
 * Article repository unit tests.
 *
 * Supabase is mocked to assert table usage, query chains, and DatabaseError
 * mapping without touching real schemas or data.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
 
import {
  articleCommentFixture,
  articleFixture,
} from "../../__tests__/test-helpers.js";
import { ArticleRepository } from "../article.repository.js";
import { ServerError } from "@/errors/ServerError.js";

const { fromMock } = vi.hoisted(() => ({ fromMock: vi.fn() }));

vi.mock("../../../../lib/supabase.js", () => ({
  supabase: { from: fromMock },
}));

describe("article.repository (unit)", () => {
  const repository = new ArticleRepository();

  beforeEach(() => {
    fromMock.mockReset();
  });

  it("create inserts into article and returns the row", async () => {
    const singleMock = vi.fn().mockResolvedValue({ data: articleFixture, error: null });
    const selectMock = vi.fn().mockReturnValue({ single: singleMock });
    const insertMock = vi.fn().mockReturnValue({ select: selectMock });

    fromMock.mockReturnValue({ insert: insertMock });

    const result = await repository.create({ title: "t" } as any);

    expect(fromMock).toHaveBeenCalledWith("article");
    expect(insertMock).toHaveBeenCalledTimes(1);
    expect(result.id).toBe(articleFixture.id);
  });

  it("list performs ordered select and a count query", async () => {
    const orderMock = vi.fn().mockResolvedValue({ data: [articleFixture], error: null });
    const selectListMock = vi.fn().mockReturnValue({ order: orderMock });

    const selectCountMock = vi.fn().mockResolvedValue({ count: 1, error: null });

    fromMock
      .mockReturnValueOnce({ select: selectListMock })
      .mockReturnValueOnce({ select: selectCountMock });

    const result = await repository.list();

    expect(fromMock).toHaveBeenNthCalledWith(1, "article");
    expect(fromMock).toHaveBeenNthCalledWith(2, "article");
    expect(result.count).toBe(1);
    expect(result.list).toHaveLength(1);
  });

  it("listComments filters by article_id and counts", async () => {
    const orderMock = vi.fn().mockResolvedValue({ data: [articleCommentFixture], error: null });
    const eqListMock = vi.fn().mockReturnValue({ order: orderMock });
    const selectListMock = vi.fn().mockReturnValue({ eq: eqListMock });

    const eqCountMock = vi.fn().mockResolvedValue({ count: 1, error: null });
    const selectCountMock = vi.fn().mockReturnValue({ eq: eqCountMock });

    fromMock
      .mockReturnValueOnce({ select: selectListMock })
      .mockReturnValueOnce({ select: selectCountMock });

    const result = await repository.listComments(articleFixture.id);

    expect(fromMock).toHaveBeenNthCalledWith(1, "article_comment");
    expect(eqListMock).toHaveBeenCalledWith("article_id", articleFixture.id);
    expect(result.count).toBe(1);
  });

  it("maps supabase errors to DatabaseError", async () => {
    const singleMock = vi.fn().mockResolvedValue({ data: null, error: { message: "insert failed" } });
    const selectMock = vi.fn().mockReturnValue({ single: singleMock });
    const insertMock = vi.fn().mockReturnValue({ select: selectMock });

    fromMock.mockReturnValue({ insert: insertMock });

    await expect(repository.create({} as any)).rejects.toBeInstanceOf(ServerError);
  });
});
