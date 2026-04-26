import { INfcRepository } from "../domain/INfcRepository";
import { INfcActivationEventDispatcher } from "../domain/INfcActivationEventDispatcher";
import { ForbiddenError } from "@/v1/errors/HttpError";

export class ActivateCardUseCase {
  constructor(
    private readonly repository: INfcRepository,
    private readonly dispatcher?: INfcActivationEventDispatcher
  ) {}

  async execute(cardId: string, actorGdgId: string) {
    const card = await this.repository.findById(cardId);

    if (card.props.ownerGdgId !== actorGdgId) {
      throw new ForbiddenError(
        `Access denied. User '${actorGdgId}' cannot modify card '${cardId}'.`,
      );
    }

    card.activate();
    await this.repository.persistUpdates(card);

    if (this.dispatcher) {
      // Do not await to prevent blocking the HTTP response
      this.dispatcher.dispatchActivationSuccess(actorGdgId, cardId).catch(console.error);
    }

    return card;
  }
}
