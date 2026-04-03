import { SparkmatesModuleController } from "@/v1/modules/sparkmatesModule_deprecated/SparkmatesModuleController";
import { SparkmatesRepository } from "@/v1/modules/sparkmatesModule_deprecated/infrastructure/SparkmatesRepository";
import { ActivateCardByGdgIdUseCase } from "@/v1/modules/sparkmatesModule_deprecated/useCase/ActivateCardByGdgIdUseCase";
import { GetCardStatusByGdgIdUseCase } from "@/v1/modules/sparkmatesModule_deprecated/useCase/GetCardStatusByGdgIdUseCase";
import { GetSparkmateByGdgIdUseCase } from "@/v1/modules/sparkmatesModule_deprecated/useCase/GetSparkmateByGdgIdUseCase";
import { RegisterCardByGdgIdUseCase } from "@/v1/modules/sparkmatesModule_deprecated/useCase/RegisterCardByGdgIdUseCase";
import { RegisterCardsBulkUseCase } from "@/v1/modules/sparkmatesModule_deprecated/useCase/RegisterCardsBulkUseCase";
import { PortfolioServiceAdapter } from "@/v1/modules/sparkmatesModule_deprecated/infrastructure/PortfolioServiceAdapter"; 

const portfolioService = new PortfolioServiceAdapter();
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

/**
 * @deprecated
 */
export const sparkmatesModuleController = new SparkmatesModuleController(
  getCardStatusByGdgIdUseCase,
  activateCardByGdgIdUseCase,
  getSparkmateByGdgIdUseCase,
  registerCardByGdgIdUseCase,
  registerCardsBulkUseCase,
);

/**
 * @deprecated
 */
export * from "@/v1/modules/sparkmatesModule_deprecated/SparkmatesModuleController";
