import { IPortfolioRepository } from "../domain/IPortfolioRepository";
import { Portfolio } from "../domain/Portfolio";

export class ListPortfoliosUseCase {
  constructor(private readonly portfolioRepository: IPortfolioRepository) {}

  async execute(
    pageNumber: number,
    pageSize: number,
  ): Promise<{ list: Portfolio[]; count: number }> {
    return this.portfolioRepository.listPortfolios(pageNumber, pageSize);
  }
}
