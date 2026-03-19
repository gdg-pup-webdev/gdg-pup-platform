import { ISparkmatesPortfolioService } from "../domain/ISparkmatesPortfolioService";
import { SparkmatesPublicPortfolio } from "../domain/Sparkmates";
import { PortfolioModuleController } from "../../portfolioModule/PortfolioModuleController";

export class PortfolioServiceAdapter implements ISparkmatesPortfolioService {
  constructor(private readonly portfolioController: PortfolioModuleController) {}

  private toYearAndProgram(
    program: string | null,
    yearLevel: number | null,
  ): string | null {
    if (!program && (yearLevel === null || yearLevel === undefined)) {
      return null;
    }

    if (yearLevel === null || yearLevel === undefined) {
      return program;
    }

    if (!program) {
      return `${yearLevel}`;
    }

    return `${yearLevel} - ${program}`;
  }

  async getPortfolioByGdgId(gdgId: string): Promise<SparkmatesPublicPortfolio> {
    const portfolio = await this.portfolioController.getPortfolioByGdgId(gdgId);

    return {
      id: portfolio.id,
      userId: portfolio.userId,
      createdAt: portfolio.createdAt,
      updatedAt: portfolio.updatedAt,
      fullName: [portfolio.firstName, portfolio.lastName].filter(Boolean).join(" ") || null,
      nickname: portfolio.nickname,
      gdgId: portfolio.gdgId,
      membershipType: portfolio.membershipType,
      department: portfolio.department,
      yearAndProgram: this.toYearAndProgram(portfolio.program, portfolio.yearLevel),
      bio: portfolio.bio,
      githubUrl: portfolio.githubUrl,
      linkedinUrl: portfolio.linkedinUrl,
      portfolioWebsiteUrl: portfolio.portfolioWebsiteUrl,
      otherLinks: portfolio.otherLinks,
      technicalSkills: portfolio.technicalSkills,
      learningInterests: portfolio.learningInterests,
      toolsAndTechnologies: portfolio.toolsAndTechnologies,
      isPublic: portfolio.isPublic,
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
