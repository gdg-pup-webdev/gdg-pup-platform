/**
 * Article service unit tests.
 *
 * The repository is mocked to validate orchestration (author_id injection
 * and comment flows) plus RepositoryError mapping without DB access.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DatabaseError } from "../../../../classes/ServerError.js";
import {
  articleCommentFixture,
  articleFixture,
  listResult,
} from "../../__tests__/test-helpers.js";
import { ArticleService } from "../article.service.js";

const {
  repoCreate,
  repoList,
  repoGetOne,
  repoUpdate,
  repoDelete,
  repoListComments,
  repoCreateComment,
  repoDeleteComment,
} = vi.hoisted(() => ({
  repoCreate: vi.fn(),
  repoList: vi.fn(),
  repoGetOne: vi.fn(),
  repoUpdate: vi.fn(),
  repoDelete: vi.fn(),
  repoListComments: vi.fn(),
  repoCreateComment: vi.fn(),
  repoDeleteComment: vi.fn(),
}));

vi.mock("../article.repository.js", () => ({
  articleRepositoryInstance: {
    create: repoCreate,
    list: repoList,
    getOne: repoGetOne,
    update: repoUpdate,
    delete: repoDelete,
    listComments: repoListComments,
    createComment: repoCreateComment,
    deleteComment: repoDeleteComment,
  },
  ArticleRepository: class {},
}));

describe("article.service (unit)", () => {
  const service = new ArticleService();

  beforeEach(() => {
    repoCreate.mockReset();
    repoList.mockReset();
    repoGetOne.mockReset();
    repoUpdate.mockReset();
    repoDelete.mockReset();
    repoListComments.mockReset();
    repoCreateComment.mockReset();
    repoDeleteComment.mockReset();
  });

  it("create injects author_id before delegating to the repository", async () => {
    repoCreate.mockResolvedValue(articleFixture);

    await service.create({ title: articleFixture.title } as any, "user-1");

    expect(repoCreate).toHaveBeenCalledWith(
      expect.objectContaining({ author_id: "user-1" }),
    );
  });

  it("list delegates to the repository", async () => {
    repoList.mockResolvedValue(listResult(articleFixture));

    const result = await service.list();

    expect(repoList).toHaveBeenCalledTimes(1);
    expect(result.count).toBe(1);
  });

  it("getOne delegates to the repository", async () => {
    repoGetOne.mockResolvedValue(articleFixture);

    const result = await service.getOne(articleFixture.id);

    expect(repoGetOne).toHaveBeenCalledWith(articleFixture.id);
    expect(result.id).toBe(articleFixture.id);
  });

  it("update delegates to the repository", async () => {
    repoUpdate.mockResolvedValue({ ...articleFixture, title: "Updated" });

    await service.update(articleFixture.id, { title: "Updated" } as any);

    expect(repoUpdate).toHaveBeenCalledWith(
      articleFixture.id,
      expect.objectContaining({ title: "Updated" }),
    );
  });

  it("delete delegates to the repository", async () => {
    repoDelete.mockResolvedValue(articleFixture);

    await service.delete(articleFixture.id);

    expect(repoDelete).toHaveBeenCalledWith(articleFixture.id);
  });

  it("listComments delegates to the repository", async () => {
    repoListComments.mockResolvedValue(listResult(articleCommentFixture));

    const result = await service.listComments(articleFixture.id);

    expect(repoListComments).toHaveBeenCalledWith(articleFixture.id);
    expect(result.count).toBe(1);
  });

  it("createComment delegates to the repository", async () => {
    repoCreateComment.mockResolvedValue(articleCommentFixture);

    await service.createComment({ body: articleCommentFixture.body } as any);

    expect(repoCreateComment).toHaveBeenCalledTimes(1);
  });

  it("deleteComment delegates to the repository", async () => {
    repoDeleteComment.mockResolvedValue(articleCommentFixture);

    await service.deleteComment(articleCommentFixture.id);

    expect(repoDeleteComment).toHaveBeenCalledWith(articleCommentFixture.id);
  });

  it("maps repository errors to RepositoryError-shaped failures", async () => {
    repoCreate.mockRejectedValue(new DatabaseError("db failure"));

    await expect(
      service.create({ title: "bad" } as any, "user-1"),
    ).rejects.toMatchObject({
      title: "Database Error",
      statusCode: 500,
    });
  });
});
