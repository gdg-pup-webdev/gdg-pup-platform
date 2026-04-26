import { Router } from "express";
import { ProductHttpController } from "./products.controller";
import { requireAuthenticated } from "@/v1/middlewares/auth.middleware";
import { requirePermissions } from "@/v1/middlewares/rbac.middleware";

export class ProductRouter {
  router: Router;

  constructor(private productHttpController: ProductHttpController) {
    this.router = Router();


    this.router.get("/", this.productHttpController.list);
    this.router.get("/:id", this.productHttpController.getOne);

    /**
     * PROTECTED ROUTES
     */
    this.router.use(requirePermissions({
      products: ["queries", "mutations"],
    }));
    this.router.post("/", this.productHttpController.create);
    this.router.patch("/:id", this.productHttpController.update);
    this.router.delete("/:id", this.productHttpController.delete);
  }
}
