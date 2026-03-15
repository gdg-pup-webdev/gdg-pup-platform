import {
  AuthMiddleware,
  authMiddlewareInstance,
} from "@/v1/middlewares/auth.middleware";
import { Router } from "express";
import { NfcSystemHttpController } from "./nfcSystem.controller";

export class NfcSystemRouter {
  router: Router;

  constructor(
    private readonly controller: NfcSystemHttpController,
    private readonly authMiddleware: AuthMiddleware = authMiddlewareInstance,
  ) {
    this.router = Router();

    this.router.get("/nfc/:gdgId/status", this.controller.getNfcStatusByGdgId);

    this.router.post(
      "/nfc/:gdgId/activate",
      this.authMiddleware.requireAuth(),
      this.controller.activateNfcByGdgId,
    );

    this.router.post(
      "/nfc/register",
      this.authMiddleware.requireAuth(),
      this.authMiddleware.requireAdminRole(),
      this.controller.registerNfc,
    );

    this.router.post(
      "/nfc/register-bulk",
      this.authMiddleware.requireAuth(),
      this.authMiddleware.requireAdminRole(),
      this.controller.registerNfcBulk,
    );
  }
}
