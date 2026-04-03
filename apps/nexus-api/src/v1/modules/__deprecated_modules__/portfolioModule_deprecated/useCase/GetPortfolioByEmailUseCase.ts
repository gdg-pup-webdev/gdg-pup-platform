import { IPortfolioRepository } from "../domain/IPortfolioRepository";
import { Portfolio } from "../domain/Portfolio";

export class GetPortfolioByEmailUseCase {
  constructor(private readonly portfolioRepository: IPortfolioRepository) {}

  async execute(email: string): Promise<Portfolio> {
    return this.portfolioRepository.findByEmail(email);
  }
}
