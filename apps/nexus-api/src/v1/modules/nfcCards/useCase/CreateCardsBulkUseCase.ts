import { ISparkmatesRepository } from "@/v1/modules/sparkmatesModule/domain/ISparkmatesRepository";
import { NfcCard } from "../domain/NfcCard";
import { INfcRepository } from "../domain/INfcRepository";

export class CreateCardsBulkUseCase {
  constructor(private readonly repository: INfcRepository) {}

  async execute(
    cards: Array<{
      gdgId: string;
      notes?: string | null;
    }>,
  ) {

    const newCards =  cards.map((card) => NfcCard.create({
      ownerGdgId: card.gdgId, 
      notes: card.notes || null, 
    }))

    return await this.repository.saveCardsBulk(newCards); 
  }
}
