import { RequestHandler } from "express";
import { ArticleService, articleServiceInstance } from "./article.service.js";
import { contract } from "@packages/nexus-api-contracts";
import { createExpressController } from "@packages/typed-rest";

export class ArticleController {
  constructor(
    private articleService: ArticleService = articleServiceInstance,
  ) {}

  list: RequestHandler = createExpressController(
    contract.api.publication_system.articles.GET,
    async ({ input, output }) => {
      const pageNumber = input.query.pageNumber;
      const pageSize = input.query.pageSize;
      const data = await this.articleService.list();

      return output(200, {
        status: "success",
        message: "Articles fetched successfully",
        data: data.list,
        meta: {
          totalRecords: data.count,
          currentPage: pageNumber,
          pageSize,
          totalPages: Math.ceil(data.count / pageSize),
        },
      });
    },
  );

  create: RequestHandler = createExpressController(
    contract.api.publication_system.articles.POST,
    async ({ input, output, ctx }) => {
      const { req } = ctx;
      const user = req.user!;
      const dto = input.body.data;

      const data = await this.articleService.create(dto, user.id);

      return output(200, {
        status: "success",
        message: "Article created successfully",
        data,
      });
    },
  );

  getOne: RequestHandler = createExpressController(
    contract.api.publication_system.articles.articleId.GET,
    async ({ input, output }) => {
      const { articleId } = input.params;
      const data = await this.articleService.getOne(articleId);

      return output(200, {
        status: "success",
        message: "Article fetched successfully",
        data,
      });
    },
  );

  update: RequestHandler = createExpressController(
    contract.api.publication_system.articles.articleId.PATCH,
    async ({ input, output }) => {
      const { articleId } = input.params;
      const dto = input.body.data;
      const data = await this.articleService.update(articleId, dto);

      return output(200, {
        status: "success",
        message: "Article updated successfully",
        data,
      });
    },
  );

  delete: RequestHandler = createExpressController(
    contract.api.publication_system.articles.articleId.DELETE,
    async ({ input, output }) => {
      const { articleId } = input.params;
      await this.articleService.delete(articleId);

      return output(200, {
        status: "success",
        message: "Article deleted successfully",
      });
    },
  );

  listComments: RequestHandler = createExpressController(
    contract.api.publication_system.articles.articleId.comments.GET,
    async ({ input, output }) => {
      const { articleId } = input.params;
      const data = await this.articleService.listComments(articleId);

      return output(200, {
        status: "success",
        message: "Comments fetched successfully",
        data: data.list,
        meta: {
          totalRecords: data.count,
          currentPage: 1,
          pageSize: 100,
          totalPages: 1,
        },
      });
    },
  );

  createComment: RequestHandler = createExpressController(
    contract.api.publication_system.articles.articleId.comments.POST,
    async ({ input, output, ctx }) => {
      const { articleId } = input.params;
      const { req } = ctx;
      const user = req.user!;

      const data = await this.articleService.createComment({
        article_id: articleId,
        user_id: user.id,
        body: input.body.data.body,
      });

      return output(201, {
        status: "success",
        message: "Comment created successfully",
        data,
      });
    },
  );

  deleteComment: RequestHandler = createExpressController(
    contract.api.publication_system.articles.articleId.comments.commentId
      .DELETE,
    async ({ input, output }) => {
      const { commentId } = input.params;
      const data = await this.articleService.deleteComment(commentId);

      return output(200, {
        status: "success",
        message: "Comment deleted successfully",
      });
    },
  );
}

export const articleControllerInstance = new ArticleController();
