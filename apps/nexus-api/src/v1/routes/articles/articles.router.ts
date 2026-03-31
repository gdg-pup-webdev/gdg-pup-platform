import { Router } from "express";
import { ArticlesHttpController } from "./articles.controller";

export class ArticlesRouter {
  router: Router;

  constructor(private readonly controller: ArticlesHttpController) {
    this.router = Router();

    this.router.get("/", this.controller.getList);
    this.router.post("/", this.controller.postCreate);

    this.router.get("/:id", this.controller.getOne);
    this.router.patch("/:id", this.controller.patchUpdate);
    this.router.delete("/:id", this.controller.deleteItem);
  }
}
