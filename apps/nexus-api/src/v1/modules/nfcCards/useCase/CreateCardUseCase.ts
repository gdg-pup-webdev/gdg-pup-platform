import { INfcRepository } from "../domain/INfcRepository";
import { NfcCard } from "../domain/NfcCard";

export class CreateCardUseCase {
  constructor(private readonly repository: INfcRepository) {}

  async execute(gdgId: string, notes?: string | null) {
    const card = NfcCard.create({
      ownerGdgId: gdgId,
      notes: notes || null,
    });
    await this.repository.saveCard(card);
    return card;
  }
}
