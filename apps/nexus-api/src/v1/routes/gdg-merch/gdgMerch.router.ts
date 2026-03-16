import { Router } from "express";
import { GdgMerchHttpController } from "./gdgMerch.controller";

export class GdgMerchRouter {
  router: Router;

  constructor(private gdgMerchHttpController: GdgMerchHttpController) {
    this.router = Router();

    this.router.get("/", this.gdgMerchHttpController.list);
    this.router.post("/", this.gdgMerchHttpController.create);
    this.router.get("/:id", this.gdgMerchHttpController.getOne);
    this.router.patch("/:id", this.gdgMerchHttpController.updateInfo);
    this.router.delete("/:id", this.gdgMerchHttpController.delete);
    this.router.post("/:id/redeem", this.gdgMerchHttpController.redeem);
    this.router.post("/:id/restock", this.gdgMerchHttpController.restock);
  }
}
