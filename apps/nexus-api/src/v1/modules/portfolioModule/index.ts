import { PortfolioRepository } from "./infrastructure/PortfolioRepository";
import { PortfolioModuleController } from "./PortfolioModuleController";
import { GetPortfolioByGdgIdUseCase } from "./useCase/GetPortfolioByGdgIdUseCase";
import { GetPortfolioByIdUseCase } from "./useCase/GetPortfolioByIdUseCase";
import { GetPortfolioByNameUseCase } from "./useCase/GetPortfolioByNameUseCase";
import { ListPortfoliosUseCase } from "./useCase/ListPortfoliosUseCase";
import { UpdatePortfolioPropertyUseCase } from "./useCase/UpdatePortfolioPropertyUseCase";
import { SupabaseFileRepository } from "../filesModule/infrastructure/SupabaseFileRepository";

// Infrastructure
const portfolioRepository = new PortfolioRepository();
const fileRepository = new SupabaseFileRepository();

// Use Cases
const listPortfoliosUseCase = new ListPortfoliosUseCase(portfolioRepository);
const getPortfolioByIdUseCase = new GetPortfolioByIdUseCase(portfolioRepository);
const getPortfolioByNameUseCase = new GetPortfolioByNameUseCase(portfolioRepository);
const getPortfolioByGdgIdUseCase = new GetPortfolioByGdgIdUseCase(portfolioRepository);
const updatePortfolioPropertyUseCase = new UpdatePortfolioPropertyUseCase(
  portfolioRepository,
  fileRepository,
);

// Module Controller
export const portfolioModuleController = new PortfolioModuleController(
  listPortfoliosUseCase,
  getPortfolioByIdUseCase,
  getPortfolioByNameUseCase,
  getPortfolioByGdgIdUseCase,
  updatePortfolioPropertyUseCase,
);
