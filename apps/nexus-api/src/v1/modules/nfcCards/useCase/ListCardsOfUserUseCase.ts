import { INfcRepository } from "../domain/INfcRepository";
import { ForbiddenError } from "@/v1/errors/HttpError";

export class ListCardsOfUserUseCase {
  constructor(private readonly repository: INfcRepository) {}

  async execute(actorId: string, gdgId: string) {
    if (actorId !== gdgId) {
      throw new ForbiddenError(
        `Access denied. User '${actorId}' cannot access cards of member '${gdgId}'.`,
      );
    }

    const cards = await this.repository.listCardsByGdgId(gdgId);
    return cards;
  }
}
