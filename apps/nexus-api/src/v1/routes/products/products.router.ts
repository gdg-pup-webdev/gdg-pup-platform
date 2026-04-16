import { Router } from "express";
import { ProductHttpController } from "./products.controller";

export class ProductRouter {
  router: Router;

  constructor(private productHttpController: ProductHttpController) {
    this.router = Router();

    this.router.get("/", this.productHttpController.list);
    this.router.post("/", this.productHttpController.create);
    this.router.get("/:id", this.productHttpController.getOne);
    this.router.patch("/:id", this.productHttpController.update);
    this.router.delete("/:id", this.productHttpController.delete);
  }
}
