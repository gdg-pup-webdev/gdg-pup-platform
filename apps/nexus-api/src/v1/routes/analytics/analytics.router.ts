import { Router } from "express";
import { AnalyticsHttpController } from "./analytics.controller";
import { requireAuthenticated } from "@/v1/middlewares/auth.middleware";

export class AnalyticsRouter {
  router: Router;

  constructor(
    private readonly controller: AnalyticsHttpController,
  ) {
    this.router = Router();

    this.router.post("/nfc-scans", this.controller.postNfcScans);
    
    this.router.post("/profile-views", this.controller.postProfileViews);


    /**
     * AUTHENTICATED ROUTES 
     */
    this.router.use(requireAuthenticated());

    this.router.get("/nfc-scans/:cardId", this.controller.getNfcScansCardId);
    this.router.get("/profile-views/:gdgId", this.controller.getProfileViewsGdgId);
  }
}
