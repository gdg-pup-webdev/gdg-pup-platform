import { ActivateCardUseCase } from "./useCase/ActivateCardUseCase";
import { CreateCardsBulkUseCase } from "./useCase/CreateCardsBulkUseCase";
import { CreateCardUseCase } from "./useCase/CreateCardUseCase";
import { GetCardStatusUseCase } from "./useCase/GetCardStatusUseCase";
import { GetCardUseCase } from "./useCase/GetCardUseCase";
import { GetDestinationUrlUseCase } from "./useCase/GetDestinationUrlUseCase";
import { ListCardsOfUserUseCase } from "./useCase/ListCardsOfUserUseCase";
import { SetDestinationUrlUseCase } from "./useCase/SetDestinationUrlUseCase";

export class NfcCardsModuleController {
  constructor(
    private readonly activateCardUC: ActivateCardUseCase,
    private readonly createCardBulkUC: CreateCardsBulkUseCase,
    private readonly createCardUC: CreateCardUseCase,
    private readonly getCardStatusUC: GetCardStatusUseCase,
    private readonly getCardUC: GetCardUseCase,
    private readonly getDestinationUrlUC: GetDestinationUrlUseCase,
    private readonly setDestinationUrlUC: SetDestinationUrlUseCase,
    private readonly listCardsOfUserUC: ListCardsOfUserUseCase,
  ) {}

  async listCardsOfUser(gdgId: string) {
    const res = await this.listCardsOfUserUC.execute(gdgId);
    return res.map((card) => ({
      id: card.props.id,
      ownerGdgId: card.props.ownerGdgId,
      status: card.props.status,
      notes: card.props.notes,
      destinationUrl: card.props.destinationUrl,
      activated_at: card.props.activated_at,
      suspended_at: card.props.suspended_at,
      revoked_at: card.props.revoked_at,
    }));
  }

  async setDestinationUrl(actorId: string, cardId: string, newDestinationUrl: string) {
    const res = await this.setDestinationUrlUC.execute(
      actorId,
      cardId,
      newDestinationUrl,
    );
    return {
      id: res.props.id,
      ownerGdgId: res.props.ownerGdgId,
      status: res.props.status,
      notes: res.props.notes,
      destinationUrl: res.props.destinationUrl,
      activated_at: res.props.activated_at,
      suspended_at: res.props.suspended_at,
      revoked_at: res.props.revoked_at,
    };
  }

  async getDestinationUrl(cardId: string) {
    return await this.getDestinationUrlUC.execute(cardId);
  }

  async getCard(cardId: string) {
    const res = await this.getCardUC.execute(cardId);
    return {
      id: res.props.id,
      ownerGdgId: res.props.ownerGdgId,
      status: res.props.status,
      notes: res.props.notes,
      destinationUrl: res.props.destinationUrl,
      activated_at: res.props.activated_at,
      suspended_at: res.props.suspended_at,
      revoked_at: res.props.revoked_at,
    };
  }

  async activateCard(cardId: string, actorGdgId: string) {
    const res = await this.activateCardUC.execute(cardId, actorGdgId);
    return {
      id: res.props.id,
      ownerGdgId: res.props.ownerGdgId,
      status: res.props.status,
      notes: res.props.notes,
      destinationUrl: res.props.destinationUrl,
      activated_at: res.props.activated_at,
      suspended_at: res.props.suspended_at,
      revoked_at: res.props.revoked_at,
    };
  }

  async createCardBulk(cards: Array<{ gdgId: string; notes?: string | null }>) {
    return await this.createCardBulkUC.execute(cards);
  }

  async createCard(gdgId: string, notes?: string | null) {
    const res = await this.createCardUC.execute(gdgId, notes);
    return {
      id: res.props.id,
      ownerGdgId: res.props.ownerGdgId,
      status: res.props.status,
      notes: res.props.notes,
      destinationUrl: res.props.destinationUrl,
      activated_at: res.props.activated_at,
      suspended_at: res.props.suspended_at,
      revoked_at: res.props.revoked_at,
    };
  }

  async getCardStatus(cardId: string) {
    return await this.getCardStatusUC.execute(cardId);
  }
}
