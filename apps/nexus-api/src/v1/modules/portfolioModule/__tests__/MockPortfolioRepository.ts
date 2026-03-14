import { NotFoundError } from "@/v1/errors/HttpError";
import { IPortfolioRepository } from "../domain/IPortfolioRepository";
import { Portfolio, PortfolioProps } from "../domain/Portfolio";

/**
 * In-memory mock implementation of IPortfolioRepository for use in unit tests.
 * Seed `portfolios` before each test to control the repository state.
 */
export class MockPortfolioRepository implements IPortfolioRepository {
  portfolios: Portfolio[] = [];

  async findById(portfolioId: string): Promise<Portfolio> {
    const portfolio = this.portfolios.find((p) => p.props.id === portfolioId);

    if (!portfolio) {
      throw new NotFoundError(`Portfolio not found for ID: ${portfolioId}`);
    }

    return portfolio;
  }

  async findByName(displayName: string): Promise<Portfolio> {
    const portfolio = this.portfolios.find(
      (p) => p.props.nickname === displayName,
    );

    if (!portfolio) {
      throw new NotFoundError(`Portfolio not found for name: ${displayName}`);
    }

    return portfolio;
  }

  async findByGdgId(gdgId: string): Promise<Portfolio> {
    const portfolio = this.portfolios.find((p) => p.props.gdgId === gdgId);

    if (!portfolio) {
      throw new NotFoundError(`Portfolio not found for GDG ID: ${gdgId}`);
    }

    return portfolio;
  }

  async listPortfolios(
    pageNumber: number,
    pageSize: number,
  ): Promise<{ list: Portfolio[]; count: number }> {
    const count = this.portfolios.length;
    const from = (pageNumber - 1) * pageSize;
    const list = this.portfolios.slice(from, from + pageSize);

    return { list, count };
  }

  async persistUpdates(portfolio: Portfolio): Promise<Portfolio> {
    const index = this.portfolios.findIndex(
      (p) => p.props.id === portfolio.props.id,
    );

    if (index === -1) {
      throw new NotFoundError(
        `Portfolio not found for ID: ${portfolio.props.id}`,
      );
    }

    this.portfolios[index] = portfolio;

    return portfolio;
  }
}

// ─── Helpers ────────────────────────────────────────────────────────────────

export function buildPortfolioProps(overrides: Partial<PortfolioProps> = {}): PortfolioProps {
  return {
    id: "portfolio-1",
    userId: "user-1",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    fullName: "Juan Dela Cruz",
    nickname: "juan",
    gdgId: "GDG-001",
    membershipType: "Member",
    department: "Web Dev",
    yearAndProgram: "3rd Year BSCS",
    bio: "Passionate developer.",
    githubUrl: "https://github.com/juan",
    linkedinUrl: "https://linkedin.com/in/juan",
    portfolioWebsiteUrl: "https://juan.dev",
    otherLinks: [],
    technicalSkills: ["TypeScript", "React"],
    learningInterests: ["AI", "Cloud"],
    toolsAndTechnologies: ["Figma", "GitHub"],
    isPublic: true,
    ...overrides,
  };
}
