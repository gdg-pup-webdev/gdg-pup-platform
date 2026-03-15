import { Portfolio, PortfolioUpdateProps } from "./Portfolio";

export abstract class IPortfolioRepository {
  abstract findById(portfolioId: string): Promise<Portfolio>;
  abstract findByName(displayName: string): Promise<Portfolio>;
  abstract findByGdgId(gdgId: string): Promise<Portfolio>;
  abstract listPortfolios(
    pageNumber: number,
    pageSize: number,
  ): Promise<{ list: Portfolio[]; count: number }>;
  abstract persistUpdates(portfolio: Portfolio): Promise<Portfolio>;
}
