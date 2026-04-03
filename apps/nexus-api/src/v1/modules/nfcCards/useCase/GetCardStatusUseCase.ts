import { INfcRepository } from "../domain/INfcRepository";

export class GetCardStatusUseCase {
  constructor(private readonly repository: INfcRepository) {}

  async execute(cardId: string) {
    const card = await this.repository.findById(cardId);
    return card.props.status;
  }
}
