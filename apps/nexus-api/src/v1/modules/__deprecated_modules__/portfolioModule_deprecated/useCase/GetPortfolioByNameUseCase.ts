import { IPortfolioRepository } from "../domain/IPortfolioRepository";
import { Portfolio } from "../domain/Portfolio";

export class GetPortfolioByNameUseCase {
  constructor(private readonly portfolioRepository: IPortfolioRepository) {}

  async execute(displayName: string): Promise<Portfolio> {
    return this.portfolioRepository.findByName(displayName);
  }
}
