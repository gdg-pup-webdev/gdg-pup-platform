import { NotFoundError } from "@/v1/errors/HttpError";
import { INfcRepository } from "../domain/INfcRepository";

export class GetCardByGdgId {
  constructor(private readonly repository: INfcRepository) {}

  async execute(gdgId: string) {
    const card = await this.repository.findByGdgid(gdgId);

    if (!card) {
      throw new NotFoundError("Card not found");
    }

    return card;
  }
}
