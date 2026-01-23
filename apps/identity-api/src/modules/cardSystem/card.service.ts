import { Tables, TablesInsert } from "@/types/supabase.types.js";
import { CardRepository, cardRepositoryInstance } from "./card.repository.js";
import { tryCatch } from "@/utils/tryCatch.util.js";
import {
  BadRequestError,
  NotFoundError,
  RepositoryError,
} from "@/classes/ServerError.js";

type cardRow = Tables<"nfc_card">;
type cardInsertDTO = TablesInsert<"nfc_card">;
type cardUpdateDTO = TablesInsert<"nfc_card">;

export class CardService {
  constructor(
    private readonly cardRepository: CardRepository = cardRepositoryInstance,
  ) {}

  getCardStatus = async (cardUid: string) => {
    const { data: card, error } = await tryCatch(
      async () => await this.cardRepository.getCardByUid(cardUid),
      "fetching card status",
    );

    if (error) throw new RepositoryError(error.message);

    if (!card) throw new NotFoundError("Card not found");

    // TODO: Fetch user if card.user_id exists
    // For now, return null for user
    return {
      card,
      user: null,
    };
  };

  activateCard = async (cardUid: string, userId: string) => {
    // 1. Verify card exists and is READY
    const { data: card, error: fetchError } = await tryCatch(
      async () => await this.cardRepository.getCardByUid(cardUid),
      "fetching card",
    );

    if (fetchError) throw new RepositoryError(fetchError.message);

    if (!card) throw new NotFoundError("Card not found");

    if (card.status === "ACTIVATED") {
      throw new BadRequestError("Card is already activated");
    }

    if (card.status !== "READY") {
      throw new BadRequestError(
        `Card is not ready for activation (Status: ${card.status}`,
      );
    }

    // 2. Activate the card
    const { data, error: updateError } = await tryCatch(
      async () => await this.cardRepository.activateCard(cardUid, userId),
      "activating card",
    );

    if (updateError) throw new RepositoryError(updateError.message);

    // 3. Log transaction
    const { data: transaction, error: transactionError } = await tryCatch(
      async () =>
        await this.cardRepository.logTransaction(cardUid, "ACTIVATION", {
          userId,
        }),
      "logging activation transaction",
    );

    if (transactionError) throw new RepositoryError(transactionError.message);

    return data;
  };

  createCard = async (dto: cardInsertDTO) => {
    const { data, error } = await tryCatch(
      async () => await this.cardRepository.create(dto),
      "creating card",
    );
    if (error) throw new RepositoryError(error.message);
    return data;
  };

  listCards = async (pageNumber: number, pageSize: number) => {
    const { data, error } = await tryCatch(
      async () => await this.cardRepository.listCards(pageNumber, pageSize),
      "listing cards",
    );
    if (error) throw new RepositoryError(error.message);
    return data;
  };
}

export const cardServiceInstance = new CardService();
