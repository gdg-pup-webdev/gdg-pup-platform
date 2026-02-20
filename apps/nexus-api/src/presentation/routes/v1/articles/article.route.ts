import { Router } from "express";
import { ArticlesHttpController } from "./article.controller.js";
import { AuthMiddleware } from "@/presentation/middlewares/auth.middleware.js";

export class ArticlesRouter {
  router: Router;

  constructor(
    private articleSystemController: ArticlesHttpController,
    private authMiddleware: AuthMiddleware,
  ) {
    this.router = Router();

    this.router.get("/", this.articleSystemController.list);

    this.router.post(
      "/",
      this.authMiddleware.requireAuth(),
      this.articleSystemController.create,
    );

    this.router.delete(
      "/:articleId",
      this.authMiddleware.requireAuth(),
      this.articleSystemController.delete,
    );

    this.router.patch(
      "/:articleId",
      this.authMiddleware.requireAuth(),
      this.articleSystemController.update,
    );

    this.router.get("/:articleId", this.articleSystemController.getOne);

    this.router.get(
      "/:articleId/comments",
      this.articleSystemController.listComments,
    );

    this.router.post(
      "/:articleId/comments",
      this.authMiddleware.requireAuth(),
      this.articleSystemController.createComment,
    );

    this.router.delete(
      "/:articleId/comments/:commentId",
      this.authMiddleware.requireAuth(),
      this.articleSystemController.deleteComment,
    );
  }
}
