import { NotFoundError } from "@/v1/errors/HttpError";
import { IPortfolioRepository } from "../domain/IPortfolioRepository";
import { Portfolio, PortfolioUpdateProps } from "../domain/Portfolio";

export class UpdatePortfolioPropertyUseCase {
  constructor(private readonly portfolioRepository: IPortfolioRepository) {}

  async execute(
    portfolioId: string,
    updates: PortfolioUpdateProps,
  ): Promise<Portfolio> {
    const portfolio = await this.portfolioRepository.findById(portfolioId);

    portfolio.update(updates);

    return this.portfolioRepository.persistUpdates(portfolio);
  }
}
