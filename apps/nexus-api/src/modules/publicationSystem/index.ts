import { Router } from "express";
import { ArticleRouter, articleRouterInstance } from "./article.route";

export class PublicationSystemRouter {
  constructor(private articleRouter: ArticleRouter = articleRouterInstance) {}

  getRouter = (): Router => {
    const router = Router();

    router.use("/articles", this.articleRouter.getRouter());

    return router;
  };
}

export const publicationSystemRouterInstance = new PublicationSystemRouter();
