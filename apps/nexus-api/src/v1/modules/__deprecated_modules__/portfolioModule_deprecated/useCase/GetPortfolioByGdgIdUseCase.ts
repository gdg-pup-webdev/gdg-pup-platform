import { IPortfolioRepository } from "../domain/IPortfolioRepository";
import { Portfolio } from "../domain/Portfolio";

export class GetPortfolioByGdgIdUseCase {
  constructor(private readonly portfolioRepository: IPortfolioRepository) {}

  async execute(gdgId: string): Promise<Portfolio> {
    return this.portfolioRepository.findByGdgId(gdgId);
  }
}
