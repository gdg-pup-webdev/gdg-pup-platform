import { Router } from "express";
import {
  ArticleController,
  articleControllerInstance,
} from "./article.controller.js";
import {
  AuthMiddleware,
  authMiddlewareInstance,
} from "../../../middlewares/auth.middleware.js";

export class ArticleRouter {
  constructor(
    private articleSystemController: ArticleController = articleControllerInstance,
    private authMiddleware: AuthMiddleware = authMiddlewareInstance,
  ) {}

  getRouter() {
    const router: Router = Router();

    router.get("/", this.articleSystemController.list);

    router.post(
      "/",
      this.authMiddleware.requireAuth(),
      this.articleSystemController.create,
    );

    router.delete(
      "/:articleId",
      this.authMiddleware.requireAuth(),
      this.articleSystemController.delete,
    );

    router.patch(
      "/:articleId",
      this.authMiddleware.requireAuth(),
      this.articleSystemController.update,
    );

    router.get("/:articleId", this.articleSystemController.getOne);

    router.get(
      "/:articleId/comments",
      this.articleSystemController.listComments,
    );

    router.post(
      "/:articleId/comments",
      this.authMiddleware.requireAuth(),
      this.articleSystemController.createComment,
    );

    router.delete(
      "/:articleId/comments/:commentId",
      this.authMiddleware.requireAuth(),
      this.articleSystemController.deleteComment,
    );

    return router;
  }
}

export const articleRouterInstance = new ArticleRouter();
