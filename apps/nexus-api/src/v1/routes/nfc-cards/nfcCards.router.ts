import {
  AuthMiddleware,
  authMiddlewareInstance,
} from "@/v1/middlewares/auth.middleware";
import { Router } from "express";
import { NfcCardsHttpController } from "./nfcCards.controller";

export class NfcCardsRouter {
  router: Router;

  constructor(
    private readonly controller: NfcCardsHttpController,
    private readonly authMiddleware: AuthMiddleware = authMiddlewareInstance,
  ) {
    this.router = Router();

    this.router.post(
      "/",
      this.authMiddleware.requireAuth(),
      this.controller.createCard,
    );
    this.router.post(
      "/:cardId/activate",
      this.authMiddleware.requireAuth(),
      this.controller.activateCard,
    );
    this.router.get("/:cardId", this.controller.getCard);
    this.router.get("/:cardId/status", this.controller.getStatus);
    this.router.get("/", this.controller.listCardsOfUser);
    this.router.post(
      "/:cardId/destination-url",
      this.authMiddleware.requireAuth(),
      this.controller.updateDestinationUrl,
    );
  }
}
