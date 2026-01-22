import { Models } from "@packages/identity-api-contracts/models";
import { CardRepository, cardRepositoryInstance } from "./card.repository.js";

export class CardService {
  constructor(
    private readonly cardRepository: CardRepository = cardRepositoryInstance
  ) {}

  getCardStatus = async (cardUid: string) => {
    const { data: card, error } = await this.cardRepository.getCardByUid(
      cardUid
    );

    if (error) {
      return { error };
    }

    if (!card) {
      return { error: { message: "Card not found", code: "CARD_NOT_FOUND" } };
    }

    // TODO: Fetch user if card.user_id exists
    // For now, return null for user
    return {
      data: {
        card,
        user: null,
      },
    };
  };

  activateCard = async (cardUid: string, userId: string) => {
    // 1. Verify card exists and is READY
    const { data: card, error: fetchError } =
      await this.cardRepository.getCardByUid(cardUid);

    if (fetchError) {
      return { error: fetchError };
    }

    if (!card) {
      return { error: { message: "Card not found", code: "CARD_NOT_FOUND" } };
    }

    if (card.status !== "READY") {
      return {
        error: {
          message: `Card is not ready for activation (Status: ${card.status})`,
          code: "CARD_NOT_READY",
        },
      };
    }

    // 2. Activate the card
    const { data, error: updateError } = await this.cardRepository.activateCard(
      cardUid,
      userId
    );

    if (updateError) {
      return { error: updateError };
    }

    // 3. Log transaction
    await this.cardRepository.logTransaction(cardUid, "ACTIVATION", {
      userId,
    });

    return { data };
  };

  createCard = async (
    dto: Omit<Models.cardSystem.CardModels.insertDTO, "created_at">
  ) => {
    const { data, error } = await this.cardRepository.create(dto);
    if (error) {
      return { error };
    }
    return { data };
  };
}

export const cardServiceInstance = new CardService();
