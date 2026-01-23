import { Router } from "express";
import { CardController, cardControllerInstance } from "./card.controller.js";
import {
  AuthMiddleware,
  authMiddlewareInstance,
} from "@/middlewares/auth.middleware.js";

export class CardRouter {
  constructor(
    private cardController: CardController = cardControllerInstance,
    private authMiddleware: AuthMiddleware = authMiddlewareInstance,
  ) {}

  getRouter() {
    const router: Router = Router();

    /**
     * @openapi
     * /api/card-system/cards/{cardUid}/status:
     *   get:
     *     tags:
     *       - Card System
     *     description: Get card status by UID
     *     parameters:
     *       - in: path
     *         name: cardUid
     *         required: true
     *         schema:
     *           type: string
     *         description: The unique identifier of the NFC card
     *     responses:
     *       200:
     *         description: Success
     *       404:
     *         $ref: '#/components/responses/NotFoundError'
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    router.get("/:cardUid/status", this.cardController.getCardStatus);

    /**
     * @openapi
     * /api/card-system/cards/{cardUid}/activate:
     *   post:
     *     tags:
     *       - Card System
     *     security:
     *       - bearerAuth: []
     *     description: Activate an NFC card for the authenticated user. This endpoint is called by the frontend after the user taps their NFC card (which opens the encoded URL) or scans a corresponding QR code. The frontend handles the redirect logic, authenticates the user, and then calls this endpoint with the cardUid from the URL.
     *     parameters:
     *       - in: path
     *         name: cardUid
     *         required: true
     *         schema:
     *           type: string
     *         description: The unique identifier of the NFC card (from the tap/redirect URL)
     *     responses:
     *       201:
     *         description: Card activated successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   example: success
     *                 message:
     *                   type: string
     *                   example: Card activated successfully
     *       400:
     *         $ref: '#/components/responses/BadRequestError'
     *       401:
     *         $ref: '#/components/responses/UnauthorizedError'
     *       404:
     *         $ref: '#/components/responses/NotFoundError'
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    router.post(
      "/:cardUid/activate",
      this.authMiddleware.requireAuth(),
      this.cardController.activateCard,
    );

    /**
     * create new card
     */
    router.post("/",
      this.authMiddleware.requireAuth(), this.cardController.createCard);

    return router;
  }
}

export const cardRouterInstance = new CardRouter();
