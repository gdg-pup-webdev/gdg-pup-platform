import { INfcRepository } from "../domain/INfcRepository";
import { INfcActivationEventDispatcher } from "../domain/INfcActivationEventDispatcher";
import { ForbiddenError, NotFoundError } from "@/v1/errors/HttpError";

export class ActivateByGdgId {
  constructor(
    private readonly repository: INfcRepository,
    private readonly dispatcher?: INfcActivationEventDispatcher
  ) {}

  async execute(gdgId: string, actorGdgId: string) {
    const card = await this.repository.findByGdgid(gdgId);

    if (!card) {
      throw new NotFoundError("Card not found");
    }

    if (card.props.ownerGdgId !== actorGdgId) {
      throw new ForbiddenError(
        `Access denied. User '${actorGdgId}' cannot modify member '${gdgId}'.`,
      );
    }

    card.activate();
    await this.repository.persistUpdates(card);

    if (this.dispatcher) {
      this.dispatcher.dispatchActivationSuccess(actorGdgId, card.props.id).catch(console.error);
    }

    return card;
  }
}
