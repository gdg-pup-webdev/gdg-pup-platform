import { RequestHandler } from "express";
import { ArticleService, articleServiceInstance } from "./article.service.js";
import { contract } from "@packages/nexus-api-contracts";
import { ServerError, ServiceError } from "../../classes/ServerError.js";
import { createExpressController } from "@packages/typed-rest";
import { tryCatch } from "@/utils/tryCatch.util.js";

export class ArticleController {
  constructor(
    private articleService: ArticleService = articleServiceInstance,
  ) {}

  list: RequestHandler = createExpressController(
    contract.api.publication_system.articles.GET,
    async ({ input, output }) => {
      const pageNumber = input.query.pageNumber;
      const pageSize = input.query.pageSize;
      const { data, error } = await tryCatch(
        async () => await this.articleService.list(),
        "listing articles",
      );
      if (error) throw new ServiceError(error.message);

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

      const { data, error } = await tryCatch(
        async () => await this.articleService.create(dto, user.id),
        "creating article",
      );
      if (error) throw new ServiceError(error.message);

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
      const { data, error } = await tryCatch(
        async () => await this.articleService.getOne(articleId),
        "fetching article",
      );
      if (error) throw new ServiceError(error.message);

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
      const { data, error } = await tryCatch(
        async () => await this.articleService.update(articleId, dto),
        "updating article",
      );
      if (error) throw new ServiceError(error.message);

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
      const { data, error } = await tryCatch(
        async () => await this.articleService.delete(articleId),
        "deleting article",
      );
      if (error) throw new ServiceError(error.message);

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
      const { data, error } = await tryCatch(
        async () => await this.articleService.listComments(articleId),
        "listing comments",
      );
      if (error) throw new ServiceError(error.message);

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

      // input.body.data is defined in contract as { body: string }
      const dto = {
        article_id: articleId,
        user_id: user.id,
        body: input.body.data.body,
      };

      const { data, error } = await tryCatch(
        async () => await this.articleService.createComment(dto),
        "creating comment",
      );
      if (error) throw new ServiceError(error.message);

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
      const { data, error } = await tryCatch(
        async () => await this.articleService.deleteComment(commentId),
        "deleting comment",
      );
      if (error) throw new ServiceError(error.message);

      return output(200, {
        status: "success",
        message: "Comment deleted successfully",
      });
    },
  );
}

export const articleControllerInstance = new ArticleController();
