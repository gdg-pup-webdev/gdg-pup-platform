import { Router } from "express";
import {
  ArticleRouter,
  articleRouterInstance,
} from "./articles/article.route.js";

export class PublicationSystemRouter {
  constructor(private readonly articleRouter: ArticleRouter = articleRouterInstance) {}

  getRouter = (): Router => {
    const router = Router();

    router.use("/articles", this.articleRouter.getRouter());

    return router;
  };
}

export const publicationSystemRouterInstance = new PublicationSystemRouter();
