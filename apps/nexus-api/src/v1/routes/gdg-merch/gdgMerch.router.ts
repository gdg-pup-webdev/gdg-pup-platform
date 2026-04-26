import { Router } from "express";
import { GdgMerchHttpController } from "./gdgMerch.controller";
import { requirePermissions } from "@/v1/middlewares/rbac.middleware";
import { requireAuthenticated } from "@/v1/middlewares/auth.middleware";

export class GdgMerchRouter {
  router: Router;

  constructor(private gdgMerchHttpController: GdgMerchHttpController) {
    this.router = Router();

    /**
     * PUBLIC ROUTES 
     */
    this.router.get("/", this.gdgMerchHttpController.list);
    this.router.get("/:id", this.gdgMerchHttpController.getOne);
    
    /**
     * AUTH PUBLIC ROUTES 
     */
    this.router.use(requireAuthenticated());
    this.router.post("/:id/redeem", this.gdgMerchHttpController.redeem);


    /**
     * PROTECTED ROUTES 
     */
    this.router.use(requirePermissions({
      "gdg_merch": ["mutations"],
    }))

    this.router.post("/", this.gdgMerchHttpController.create);
    this.router.patch("/:id", this.gdgMerchHttpController.updateInfo);
    this.router.delete("/:id", this.gdgMerchHttpController.delete);
    this.router.post("/:id/restock", this.gdgMerchHttpController.restock);
  }
}
