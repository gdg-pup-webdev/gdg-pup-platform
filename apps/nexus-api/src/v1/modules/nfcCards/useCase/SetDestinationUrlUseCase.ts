import { INfcRepository } from "../domain/INfcRepository";
import { ForbiddenError, ValidationError } from "@/v1/errors/HttpError";

export class SetDestinationUrlUseCase {
  constructor(private readonly repository: INfcRepository) {}

  async execute(actorId: string, cardId: string, newDestinationUrl: string) {
    const card = await this.repository.findById(cardId);

    if (card.props.ownerGdgId !== actorId) {
      throw new ForbiddenError(
        `Access denied. User '${actorId}' cannot modify card '${cardId}'.`,
      );
    }

    if (card.props.status !== "activated") {
      throw new ValidationError("Card is not activated");
    }

    card.setDestinationUrl(newDestinationUrl)

    await this.repository.persistUpdates(card);

    return card
  }
}
