import {
  AuthMiddleware,
  authMiddlewareInstance,
  requireAuthenticated,
} from "@/v1/middlewares/auth.middleware";
import { Router } from "express";
import { NfcCardsHttpController } from "./nfcCards.controller";
import { requirePermissions } from "@/v1/middlewares/rbac.middleware";

export class NfcCardsRouter {
  router: Router;

  constructor(
    private readonly controller: NfcCardsHttpController,
    private readonly authMiddleware: AuthMiddleware = authMiddlewareInstance,
  ) {
    this.router = Router();

    /**
     * PUBLIC ROUTES 
     */
    this.router.get("/:cardId", this.controller.getCard);
    this.router.get("/:cardId/status", this.controller.getStatus);

    /**
     * AUTHENTICATED ROUTES 
     */
    this.router.use(requireAuthenticated());
    this.router.post(
      "/:cardId/activate", 
      this.controller.activateCard,
    );
    this.router.post(
      "/:cardId/destination-url", 
      this.controller.updateDestinationUrl,
    );
    this.router.get("/", this.controller.listCardsOfUser);

    /**
     * PRIVATE ROUTES 
     */
    this.router.use(requirePermissions({
      "nfc-cards": ["mutations"],
    }))
    
    this.router.post(
      "/", 
      this.controller.createCard,
    );
  }
}
