/**
 * Article controller integration tests.
 *
 * These tests exercise the real Express app via supertest while mocking
 * auth and the service layer. This validates route wiring and contract
 * shapes without touching the database.
 */
import request = require("supertest");
import { beforeEach, describe, expect, it, vi } from "vitest";

import app from "../../../../app.js";
import {
  articleCommentFixture,
  articleFixture,
  listResult,
  publicationPagination,
} from "../../__tests__/test-helpers.js";

const articlesBasePath = "/api/publication-system/articles";
const articlePath = (articleId: string) => `${articlesBasePath}/${articleId}`;
const articleCommentsPath = (articleId: string) =>
  `${articlePath(articleId)}/comments`;
const articleCommentPath = (articleId: string, commentId: string) =>
  `${articleCommentsPath(articleId)}/${commentId}`;

const {
  artList,
  artCreate,
  artGetOne,
  artUpdate,
  artDelete,
  artListComments,
  artCreateComment,
  artDeleteComment,
} = vi.hoisted(() => ({
  artList: vi.fn(),
  artCreate: vi.fn(),
  artGetOne: vi.fn(),
  artUpdate: vi.fn(),
  artDelete: vi.fn(),
  artListComments: vi.fn(),
  artCreateComment: vi.fn(),
  artDeleteComment: vi.fn(),
}));

const resetMocks = () => {
  artList.mockReset();
  artCreate.mockReset();
  artGetOne.mockReset();
  artUpdate.mockReset();
  artDelete.mockReset();
  artListComments.mockReset();
  artCreateComment.mockReset();
  artDeleteComment.mockReset();
};

vi.mock("../../../../middlewares/auth.middleware.js", () => ({
  authMiddlewareInstance: {
    requireAuth:
      () => (req: any, _res: any, next: any) => ((req.user = { id: "user-1" }), next()),
  },
  AuthMiddleware: class {},
}));

vi.mock("../article.service.js", () => ({
  articleServiceInstance: {
    list: artList,
    create: artCreate,
    getOne: artGetOne,
    update: artUpdate,
    delete: artDelete,
    listComments: artListComments,
    createComment: artCreateComment,
    deleteComment: artDeleteComment,
  },
  ArticleService: class {},
}));

describe("article.controller (integration)", () => {
  beforeEach(() => {
    resetMocks();
  });

  it("GET /api/publication-system/articles returns list + meta", async () => {
    artList.mockResolvedValue(listResult(articleFixture));

    const response = await request(app)
      .get(articlesBasePath)
      .query(publicationPagination);

    expect(response.status).toBe(200);
    expect(artList).toHaveBeenCalledTimes(1);
    expect(response.body.status).toBe("success");
    expect(response.body.data).toHaveLength(1);
    expect(response.body.meta).toMatchObject({
      totalRecords: 1,
      currentPage: publicationPagination.pageNumber,
      pageSize: publicationPagination.pageSize,
      totalPages: 1,
    });
  });

  it("POST /api/publication-system/articles calls create with author id", async () => {
    artCreate.mockResolvedValue(articleFixture);

    const response = await request(app)
      .post(articlesBasePath)
      .send({
        data: {
          title: articleFixture.title,
          body: articleFixture.body,
          is_published: articleFixture.is_published,
          published_at: articleFixture.published_at,
          related_event_id: articleFixture.related_event_id,
        },
      });

    expect(response.status).toBe(200);
    expect(artCreate).toHaveBeenCalledWith(
      expect.objectContaining({ title: articleFixture.title }),
      "user-1",
    );
  });

  it("GET /api/publication-system/articles/:articleId calls getOne", async () => {
    artGetOne.mockResolvedValue(articleFixture);

    const response = await request(app).get(articlePath(articleFixture.id));

    expect(response.status).toBe(200);
    expect(artGetOne).toHaveBeenCalledWith(articleFixture.id);
  });

  it("PATCH /api/publication-system/articles/:articleId calls update", async () => {
    artUpdate.mockResolvedValue({ ...articleFixture, title: "Updated" });

    const response = await request(app)
      .patch(articlePath(articleFixture.id))
      .send({ data: { title: "Updated" } });

    expect(response.status).toBe(200);
    expect(artUpdate).toHaveBeenCalledWith(
      articleFixture.id,
      expect.objectContaining({ title: "Updated" }),
    );
  });

  it("DELETE /api/publication-system/articles/:articleId calls delete", async () => {
    artDelete.mockResolvedValue(articleFixture);

    const response = await request(app).delete(articlePath(articleFixture.id));

    expect(response.status).toBe(200);
    expect(artDelete).toHaveBeenCalledWith(articleFixture.id);
  });

  it("GET /api/publication-system/articles/:articleId/comments returns list + meta", async () => {
    artListComments.mockResolvedValue(listResult(articleCommentFixture));

    const response = await request(app).get(articleCommentsPath(articleFixture.id));

    expect(response.status).toBe(200);
    expect(artListComments).toHaveBeenCalledWith(articleFixture.id);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.meta.totalRecords).toBe(1);
  });

  it("POST /api/publication-system/articles/:articleId/comments calls createComment", async () => {
    artCreateComment.mockResolvedValue(articleCommentFixture);

    const response = await request(app)
      .post(articleCommentsPath(articleFixture.id))
      .send({ data: { body: articleCommentFixture.body } });

    expect(response.status).toBe(201);
    expect(artCreateComment).toHaveBeenCalledWith(
      expect.objectContaining({
        article_id: articleFixture.id,
        user_id: "user-1",
        body: articleCommentFixture.body,
      }),
    );
  });

  it("DELETE /api/publication-system/articles/:articleId/comments/:commentId calls deleteComment", async () => {
    artDeleteComment.mockResolvedValue(articleCommentFixture);

    const response = await request(app).delete(
      articleCommentPath(articleFixture.id, articleCommentFixture.id),
    );

    expect(response.status).toBe(200);
    expect(artDeleteComment).toHaveBeenCalledWith(articleCommentFixture.id);
  });
});
