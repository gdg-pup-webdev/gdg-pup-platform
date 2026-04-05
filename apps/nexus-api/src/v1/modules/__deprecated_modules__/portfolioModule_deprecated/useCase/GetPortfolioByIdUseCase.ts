import { IPortfolioRepository } from "../domain/IPortfolioRepository";
import { Portfolio } from "../domain/Portfolio";

export class GetPortfolioByIdUseCase {
  constructor(private readonly portfolioRepository: IPortfolioRepository) {}

  async execute(portfolioId: string): Promise<Portfolio> {
    return this.portfolioRepository.findById(portfolioId);
  }
}
