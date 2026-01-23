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
          `Something went wrong: ${error.message}`,
        );
      }

      return output(200, {
        status: "success",
        message: "Card status retrieved successfully",
        data,
      });
    },
  );

  /**
   * Activate a card for the authenticated user
   */
  activateCard: RequestHandler = createExpressController(
    contract.api.card_system.cards.cardUid.activate.POST,
    async ({ input, output, ctx }) => {
      const { cardUid } = input.params;
      const { userId } = input.body.data;

      const { data, error } = await this.cardService.activateCard(
        cardUid,
        userId,
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
          `Something went wrong: ${error.message}`,
        );
      }

      return output(201, {
        status: "success",
        message: "Card activated successfully",
      });
    },
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
        throw ServerError.unauthorized(
          "User must be authenticated to create a card",
        );
      }

      const { data, error } = await tryCatch(
        async () => await this.cardService.createCard(input.body.data),
        "creating card",
      );

      if (error) {
        // Handle specific error codes
        throw ServerError.internalError(
          `Something went wrong: ${error.message}`,
        );
      }

      return output(201, {
        status: "success",
        message: "Card created successfully",
        data,
      });
    },
  );

  /**
   * list cards
   */
  listCards: RequestHandler = createExpressController(
    contract.api.card_system.cards.GET,
    async ({ input, output, ctx }) => {
      // pagination parameters
      const pageNumber = input.query.page.number;
      const pageSize = input.query.page.size;

      const { req } = ctx;
      const user = req.user!;

      if (!user) {
        throw ServerError.unauthorized(
          "User must be authenticated to list cards",
        );
      }

      const { data, error } = await tryCatch(
        async () => await this.cardService.listCards(pageNumber, pageSize),
        "listing cards",
      );

      if (error) {
        // Handle specific error codes
        throw ServerError.internalError(
          `Something went wrong: ${error.message}`,
        );
      }

      return output(200, {
        status: "success",
        message: "Cards listed successfully",
        data: data.list,
        meta: {
          totalRecords: data.count,
          totalPages: Math.ceil(data.count / input.query.page.size),
          currentPage: input.query.page.number,
          pageSize: input.query.page.size,
        },
      });
    },
  );
}

export const cardControllerInstance = new CardController();
