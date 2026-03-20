import { Router } from "express";
import { SparkmatesHttpController } from "@/v1/routes/sparkmates/sparkmates.controller";

export class SparkmatesRouter {
  router: Router;

  constructor(private readonly controller: SparkmatesHttpController) {
    this.router = Router();

    this.router.get("/:gdgId", this.controller.getSparkmateByGdgId);
  }
}
