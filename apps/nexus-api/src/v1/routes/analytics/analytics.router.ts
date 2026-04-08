import { Router } from "express";
import { AnalyticsHttpController } from "./analytics.controller";

export class AnalyticsRouter {
  router: Router;

  constructor(
    private readonly controller: AnalyticsHttpController,
  ) {
    this.router = Router();

    this.router.post("/nfc-scans", this.controller.postNfcScans);
    this.router.get("/nfc-scans/:cardId", this.controller.getNfcScansCardId);
    
    this.router.post("/profile-views", this.controller.postProfileViews);
    this.router.get("/profile-views/:gdgId", this.controller.getProfileViewsGdgId);
  }
}
