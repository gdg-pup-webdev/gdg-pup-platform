import { gdgMembersController } from "../../../members";
import { ISparkmatesPortfolioService } from "../domain/ISparkmatesPortfolioService";
import { SparkmatesPublicPortfolio } from "../domain/Sparkmates"; 

export class PortfolioServiceAdapter implements ISparkmatesPortfolioService {
  constructor( ) {}

  async getPortfolioByGdgId(gdgId: string): Promise<SparkmatesPublicPortfolio> {
    const portfolio = await gdgMembersController.findByGdgId(gdgId);

    if (!portfolio) {
      throw new Error(`Portfolio not found for GDG ID: ${gdgId}`);
    }

    return portfolio;
  }

  async getPortfolioVisibilityByGdgId(gdgId: string): Promise<boolean> {
    const portfolio = await gdgMembersController.findByGdgId(gdgId);

    if (!portfolio) {
      throw new Error(`Portfolio not found for GDG ID: ${gdgId}`);
    }


    return portfolio.isPublic;
  }

  async setPortfolioVisibilityByGdgId(gdgId: string, isPublic: boolean): Promise<void> {
    if (isPublic) {
      await gdgMembersController.makeProfilePublic(gdgId);
    } else {
      await gdgMembersController.makeProfilePrivate(gdgId);
    }
  }
 
}
