// import { PortfolioRepository } from "./infrastructure/PortfolioRepository";
// import { PortfolioModuleController } from "./PortfolioModuleController";
// import { GetPortfolioByGdgIdUseCase } from "./useCase/GetPortfolioByGdgIdUseCase";
// import { GetPortfolioByNameUseCase } from "./useCase/GetPortfolioByNameUseCase";
// import { GetPortfolioByEmailUseCase } from "./useCase/GetPortfolioByEmailUseCase";
// import { ListPortfoliosUseCase } from "./useCase/ListPortfoliosUseCase";
// import { UpdatePortfolioPropertyUseCase } from "./useCase/UpdatePortfolioPropertyUseCase";
// import { PortfolioStorageAdapter } from "./infrastructure/PortfolioStorageAdapter";
// import { filesModuleController } from "../filesModule";

// // Infrastructure
// const portfolioRepository = new PortfolioRepository();
// const portfolioStorage = new PortfolioStorageAdapter(filesModuleController);

// // Use Cases
// const listPortfoliosUseCase = new ListPortfoliosUseCase(portfolioRepository);
// const getPortfolioByNameUseCase = new GetPortfolioByNameUseCase(
//   portfolioRepository,
// );
// const getPortfolioByGdgIdUseCase = new GetPortfolioByGdgIdUseCase(
//   portfolioRepository,
// );
// const getPortfolioByEmailUseCase = new GetPortfolioByEmailUseCase(
//   portfolioRepository,
// );
// const updatePortfolioPropertyUseCase = new UpdatePortfolioPropertyUseCase(
//   portfolioRepository,
//   portfolioStorage,
// );

// // Module Controller
// export const portfolioModuleController = new PortfolioModuleController(
//   listPortfoliosUseCase,
//   getPortfolioByNameUseCase,
//   getPortfolioByGdgIdUseCase,
//   getPortfolioByEmailUseCase,
//   updatePortfolioPropertyUseCase,
// );
