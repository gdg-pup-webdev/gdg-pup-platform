import { ISparkmatesPortfolioService } from "../domain/ISparkmatesPortfolioService";
import { SparkmatesPublicPortfolio } from "../domain/Sparkmates";
import { PortfolioModuleController } from "../../portfolioModule/PortfolioModuleController";

export class PortfolioServiceAdapter implements ISparkmatesPortfolioService {
  constructor(private readonly portfolioController: PortfolioModuleController) {}

  async getPortfolioByGdgId(gdgId: string): Promise<SparkmatesPublicPortfolio> {
    const portfolio = await this.portfolioController.getPortfolioByGdgId(gdgId);

    return {
      id: portfolio.id,
      userId: portfolio.userId,
      createdAt: portfolio.createdAt,
      updatedAt: portfolio.updatedAt,
      firstName: portfolio.firstName,
      middleName: portfolio.middleName,
      lastName: portfolio.lastName,
      nickname: portfolio.nickname,
      gdgId: portfolio.gdgId,
      membershipType: portfolio.membershipType,
      department: portfolio.department,
      yearLevel: portfolio.yearLevel,
      program: portfolio.program,
      bio: portfolio.bio,
      githubUrl: portfolio.githubUrl,
      linkedinUrl: portfolio.linkedinUrl,
      portfolioWebsiteUrl: portfolio.portfolioWebsiteUrl,
      otherLinks: portfolio.otherLinks,
      technicalSkills: portfolio.technicalSkills,
      learningInterests: portfolio.learningInterests,
      toolsAndTechnologies: portfolio.toolsAndTechnologies,
      isPublic: portfolio.isPublic,
      profileImage: portfolio.profileImage,
    };
  }

  async getPortfolioVisibilityByGdgId(gdgId: string): Promise<boolean> {
    const portfolio = await this.portfolioController.getPortfolioByGdgId(gdgId);
    return portfolio.isPublic;
  }

  async setPortfolioVisibilityByGdgId(gdgId: string, isPublic: boolean): Promise<void> {
    const portfolio = await this.portfolioController.getPortfolioByGdgId(gdgId);
    await this.portfolioController.updatePortfolioProperty(portfolio.id, {
      is_public: isPublic,
    } as any);
  }

  async getUserIdByGdgId(gdgId: string): Promise<string> {
    const portfolio = await this.portfolioController.getPortfolioByGdgId(gdgId);
    return portfolio.userId;
  }
}
