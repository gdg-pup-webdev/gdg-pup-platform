import { SparkmatesModuleController } from "@/v1/modules/sparkmatesModule/SparkmatesModuleController";
import { SparkmatesRepository } from "@/v1/modules/sparkmatesModule/infrastructure/SparkmatesRepository";
import { ActivateCardByGdgIdUseCase } from "@/v1/modules/sparkmatesModule/useCase/ActivateCardByGdgIdUseCase";
import { GetCardStatusByGdgIdUseCase } from "@/v1/modules/sparkmatesModule/useCase/GetCardStatusByGdgIdUseCase";
import { GetSparkmateByGdgIdUseCase } from "@/v1/modules/sparkmatesModule/useCase/GetSparkmateByGdgIdUseCase";
import { RegisterCardByGdgIdUseCase } from "@/v1/modules/sparkmatesModule/useCase/RegisterCardByGdgIdUseCase";
import { RegisterCardsBulkUseCase } from "@/v1/modules/sparkmatesModule/useCase/RegisterCardsBulkUseCase";
import { PortfolioServiceAdapter } from "@/v1/modules/sparkmatesModule/infrastructure/PortfolioServiceAdapter";
import { portfolioModuleController } from "@/v1/modules/portfolioModule";

const portfolioService = new PortfolioServiceAdapter(portfolioModuleController);
const sparkmatesRepository = new SparkmatesRepository(portfolioService);

const getCardStatusByGdgIdUseCase = new GetCardStatusByGdgIdUseCase(
  sparkmatesRepository,
);
const activateCardByGdgIdUseCase = new ActivateCardByGdgIdUseCase(
  sparkmatesRepository,
);
const getSparkmateByGdgIdUseCase = new GetSparkmateByGdgIdUseCase(
  sparkmatesRepository,
);
const registerCardByGdgIdUseCase = new RegisterCardByGdgIdUseCase(
  sparkmatesRepository,
);
const registerCardsBulkUseCase = new RegisterCardsBulkUseCase(
  sparkmatesRepository,
);

export const sparkmatesModuleController = new SparkmatesModuleController(
  getCardStatusByGdgIdUseCase,
  activateCardByGdgIdUseCase,
  getSparkmateByGdgIdUseCase,
  registerCardByGdgIdUseCase,
  registerCardsBulkUseCase,
);

export * from "@/v1/modules/sparkmatesModule/SparkmatesModuleController";
