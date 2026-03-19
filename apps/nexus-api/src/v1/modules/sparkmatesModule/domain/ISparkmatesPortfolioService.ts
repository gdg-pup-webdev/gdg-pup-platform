import { SparkmatesPublicPortfolio } from "./Sparkmates";

export interface ISparkmatesPortfolioService {
  getPortfolioByGdgId(gdgId: string): Promise<SparkmatesPublicPortfolio>;
  getPortfolioVisibilityByGdgId(gdgId: string): Promise<boolean>;
  setPortfolioVisibilityByGdgId(gdgId: string, isPublic: boolean): Promise<void>;
  getUserIdByGdgId(gdgId: string): Promise<string>;
}
