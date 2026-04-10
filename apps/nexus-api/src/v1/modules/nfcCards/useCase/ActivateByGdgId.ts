import { INfcRepository } from "../domain/INfcRepository";

 

export class ActivateByGdgId {
  constructor(private readonly repository: INfcRepository) {}

  async execute(gdgId: string, actorGdgId: string) {
    const card = await this.repository.findByGdgid(gdgId);

    if (!card) {
      throw new Error("Card not found");
    }

    if (card.props.ownerGdgId !== actorGdgId) {
      throw new Error("Unauthorized: Only the card owner can activate the card");
    }

    card.activate();
      await this.repository.persistUpdates(card);

    return card;
  }
}
