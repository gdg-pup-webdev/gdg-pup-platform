import { INfcRepository } from "../domain/INfcRepository";

 

export class ActivateCardUseCase {
  constructor(private readonly repository: INfcRepository) {}

  async execute(cardId: string, actorGdgId: string) {
    const card = await this.repository.findById(cardId);

    if (card.props.ownerGdgId !== actorGdgId) {
      throw new Error("Unauthorized: Only the card owner can activate the card");
    }

    card.activate();
      await this.repository.persistUpdates(card);

    return card;
  }
}
