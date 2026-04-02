import { INfcRepository } from "../domain/INfcRepository";

export class SetDestinationUrlUseCase {
  constructor(private readonly repository: INfcRepository) {}

  async execute(actorId: string, cardId: string, newDestinationUrl: string) {
    const card = await this.repository.findById(cardId);

    if (card.props.ownerGdgId !== actorId) {
      throw new Error("Unauthorized: Only the card owner can update the card");
    }

    if (card.props.status !== "activated") {
      throw new Error("Card is not activated");
    }

    card.setDestinationUrl(newDestinationUrl)

    await this.repository.persistUpdates(card);

    return card
  }
}
