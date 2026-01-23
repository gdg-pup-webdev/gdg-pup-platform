import { RequestHandler } from "express";
import { createExpressController } from "@packages/typed-rest";
import { contract } from "@packages/identity-api-contracts";
import { CardService, cardServiceInstance } from "./card.service.js";
import { ServerError } from "@/classes/ServerError.js";
import { tryCatch } from "@/utils/tryCatch.util.js";

export class CardController {
  constructor(private cardService: CardService = cardServiceInstance) {}

  /**
   * Get card status by UID
   */
  getCardStatus: RequestHandler = createExpressController(
    contract.api.card_system.cards.cardUid.status.GET,
    async ({ input, output, ctx }) => {
      const { cardUid } = input.params;
      const { data, error } = await this.cardService.getCardStatus(cardUid);

      if (error) {
        // Handle specific error codes
        if (error.code === "CARD_NOT_FOUND") {
          throw ServerError.notFound(error.message);
        }
        throw ServerError.internalError(
          `Something went wrong: ${error.message}`
        );
      }

      return output(200, {
        status: "success",
        message: "Card status retrieved successfully",
        data,
      });
    }
  );

  /**
   * Activate a card for the authenticated user
   */
  activateCard: RequestHandler = createExpressController(
    contract.api.card_system.activate.cardUid.POST,
    async ({ input, output, ctx }) => {
      const { cardUid } = input.params;
      const { req } = ctx;
      const user = req.user!;
      
      if (!user) {
        throw ServerError.unauthorized("User must be authenticated to activate a card");
      }

      const { data, error } = await this.cardService.activateCard(
        cardUid,
        user.id
      );

      if (error) {
        // Handle specific error codes
        if (error.code === "CARD_NOT_FOUND") {
          throw ServerError.notFound(error.message);
        }
        if (error.code === "CARD_NOT_READY") {
          throw ServerError.badRequest(error.message);
        }
        throw ServerError.internalError(
          `Something went wrong: ${error.message}`
        );
      }

      return output(201, {
        status: "success",
        message: "Card activated successfully",
      });
    }
  );


  /**
   * create a new card
   */
  createCard: RequestHandler = createExpressController(
    contract.api.card_system.cards.POST,
    async ({ input, output, ctx }) => {
      const { req } = ctx;
      const user = req.user!;

      if (!user) {
        throw ServerError.unauthorized("User must be authenticated to create a card");
      }

      const { data, error } = await tryCatch(
        async () => await this.cardService.createCard(input.body.data), 
        "creating card"
      );

      if (error) {
        // Handle specific error codes
        throw ServerError.internalError(
          `Something went wrong: ${error.message}`
        );
      } 

      return output(201, {
        status: "success",
        message: "Card created successfully",
        data,
      });
    }  
  );


}

export const cardControllerInstance = new CardController();
