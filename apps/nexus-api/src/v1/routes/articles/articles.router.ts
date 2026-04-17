import { Router } from "express";
import { ArticlesHttpController } from "./articles.controller";
import { requirePermissions } from "@/v1/middlewares/rbac.middleware";

export class ArticlesRouter {
  router: Router;

  constructor(private readonly controller: ArticlesHttpController) {
    this.router = Router();

    /**
     * PUBLIC ROUTES
     */
    this.router.get("/", this.controller.getList);
    this.router.get("/:id", this.controller.getOne);

    /**
     * PROTECTED ROUTES
     */
    this.router.use(
      requirePermissions({
        articles: ["mutations"],
      }),
    );

    this.router.post("/", this.controller.postCreate);
    this.router.patch("/:id", this.controller.patchUpdate);
    this.router.delete("/:id", this.controller.deleteItem);
  }
}
