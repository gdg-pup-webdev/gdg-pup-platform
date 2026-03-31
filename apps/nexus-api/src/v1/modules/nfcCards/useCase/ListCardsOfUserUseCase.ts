import { INfcRepository } from "../domain/INfcRepository";

export class ListCardsOfUserUseCase {
  constructor(private readonly repository: INfcRepository) {}

  async execute(gdgId: string) {
    const cards = await this.repository.listCardsByGdgId(gdgId);
    return cards;
  }
}
