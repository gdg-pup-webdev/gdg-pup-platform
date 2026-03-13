import { PortfolioUpdateProps } from "./domain/Portfolio";
import { GetPortfolioByGdgIdUseCase } from "./useCase/GetPortfolioByGdgIdUseCase";
import { GetPortfolioByIdUseCase } from "./useCase/GetPortfolioByIdUseCase";
import { GetPortfolioByNameUseCase } from "./useCase/GetPortfolioByNameUseCase";
import { ListPortfoliosUseCase } from "./useCase/ListPortfoliosUseCase";
import { UpdatePortfolioPropertyUseCase } from "./useCase/UpdatePortfolioPropertyUseCase";

export class PortfolioModuleController {
  constructor(
    private readonly listPortfoliosUseCase: ListPortfoliosUseCase,
    private readonly getPortfolioByIdUseCase: GetPortfolioByIdUseCase,
    private readonly getPortfolioByNameUseCase: GetPortfolioByNameUseCase,
    private readonly getPortfolioByGdgIdUseCase: GetPortfolioByGdgIdUseCase,
    private readonly updatePortfolioPropertyUseCase: UpdatePortfolioPropertyUseCase,
  ) {}

  async listPortfolios(pageNumber: number, pageSize: number) {
    const { list, count } = await this.listPortfoliosUseCase.execute(
      pageNumber,
      pageSize,
    );

    return {
      list: list.map((p) => p.props),
      count,
    };
  }

  async getPortfolioById(portfolioId: string) {
    const portfolio = await this.getPortfolioByIdUseCase.execute(portfolioId);
    return portfolio.props;
  }

  async getPortfolioByName(displayName: string) {
    const portfolio =
      await this.getPortfolioByNameUseCase.execute(displayName);
    return portfolio.props;
  }

  async getPortfolioByGdgId(gdgId: string) {
    const portfolio = await this.getPortfolioByGdgIdUseCase.execute(gdgId);
    return portfolio.props;
  }

  async updatePortfolioProperty(
    portfolioId: string,
    updates: PortfolioUpdateProps,
  ) {
    const portfolio = await this.updatePortfolioPropertyUseCase.execute(
      portfolioId,
      updates,
    );
    return portfolio.props;
  }
}
