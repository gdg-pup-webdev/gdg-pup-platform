import { NfcRepository } from "./infrastructure/NfcRepository";
import { NfcActivationDispatcher } from "./infrastructure/NfcActivationDispatcher";
import { NfcCardsModuleController } from "./NfcCardsModuleController";
import { ActivateByGdgId } from "./useCase/ActivateByGdgId";
import { ActivateCardUseCase } from "./useCase/ActivateCardUseCase";
import { CreateCardsBulkUseCase } from "./useCase/CreateCardsBulkUseCase";
import { CreateCardUseCase } from "./useCase/CreateCardUseCase";
import { GetCardByGdgId } from "./useCase/GetCardByGdgId";
import { GetCardStatusUseCase } from "./useCase/GetCardStatusUseCase";
import { GetCardUseCase } from "./useCase/GetCardUseCase";
import { GetDestinationUrlUseCase } from "./useCase/GetDestinationUrlUseCase";
import { ListCardsOfUserUseCase } from "./useCase/ListCardsOfUserUseCase";
import { SetDestinationUrlUseCase } from "./useCase/SetDestinationUrlUseCase";

const cardRepository = new NfcRepository();
const activationDispatcher = new NfcActivationDispatcher();

const activateCardUC = new ActivateCardUseCase(cardRepository, activationDispatcher);
const createCardBulkUC = new CreateCardsBulkUseCase(cardRepository);
const createCardUC = new CreateCardUseCase(cardRepository);
const getCardStatusUC = new GetCardStatusUseCase(cardRepository);
const getCardUC = new GetCardUseCase(cardRepository);
const getDestinationUrlUseCase = new GetDestinationUrlUseCase(cardRepository);

const setDestinationUrlUC = new SetDestinationUrlUseCase(cardRepository);

const listCardsOfUserUC = new ListCardsOfUserUseCase(cardRepository);

const activatebygdgid = new ActivateByGdgId(cardRepository, activationDispatcher);
const getbygdgid = new GetCardByGdgId(cardRepository);

export const nfcCardsModuleController = new NfcCardsModuleController(
  activateCardUC,
  createCardBulkUC,
  createCardUC,
  getCardStatusUC,
  getCardUC,
  getDestinationUrlUseCase,
  setDestinationUrlUC,
  listCardsOfUserUC,
  activatebygdgid,
  getbygdgid,
);

export { NfcCardsModuleController };
