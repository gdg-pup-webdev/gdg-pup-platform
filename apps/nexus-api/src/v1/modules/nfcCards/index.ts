import { NfcRepository } from "./infrastructure/NfcRepository";
import { NfcCardsModuleController } from "./NfcCardsModuleController";
import { ActivateCardUseCase } from "./useCase/ActivateCardUseCase";
import { CreateCardsBulkUseCase } from "./useCase/CreateCardsBulkUseCase";
import { CreateCardUseCase } from "./useCase/CreateCardUseCase";
import { GetCardStatusUseCase } from "./useCase/GetCardStatusUseCase";
import { GetCardUseCase } from "./useCase/GetCardUseCase";
import { GetDestinationUrlUseCase } from "./useCase/GetDestinationUrlUseCase";
import { ListCardsOfUserUseCase } from "./useCase/ListCardsOfUserUseCase";
import { SetDestinationUrlUseCase } from "./useCase/SetDestinationUrlUseCase";

const cardRepository = new NfcRepository();

const activateCardUC = new ActivateCardUseCase(cardRepository);
const createCardBulkUC = new CreateCardsBulkUseCase(cardRepository);
const createCardUC = new CreateCardUseCase(cardRepository);
const getCardStatusUC = new GetCardStatusUseCase(cardRepository);
const getCardUC = new GetCardUseCase(cardRepository);
const getDestinationUrlUseCase = new GetDestinationUrlUseCase(cardRepository);

const setDestinationUrlUC = new SetDestinationUrlUseCase(cardRepository);

const listCardsOfUserUC = new ListCardsOfUserUseCase(cardRepository);

export const nfcCardsModuleController = new NfcCardsModuleController(
  activateCardUC,
  createCardBulkUC,
  createCardUC,
  getCardStatusUC,
  getCardUC,
  getDestinationUrlUseCase,
  setDestinationUrlUC,
  listCardsOfUserUC,
);

export { NfcCardsModuleController };
