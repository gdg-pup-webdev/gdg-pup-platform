import { NotFoundError, InternalServerError } from "@/v1/errors/HttpError";
import { supabase } from "@/v1/lib/supabase";
import { Tables } from "@/v1/types/supabase.types";
import { IPortfolioRepository } from "@/v1/modules/portfolioModule/domain/IPortfolioRepository";
import {
  Portfolio,
  PortfolioProps,
} from "@/v1/modules/portfolioModule/domain/Portfolio";

type UserProfileRow = Tables<"user_profile">;
type UserRow = Tables<"user">;

type PortfolioSelectRow = UserProfileRow & {
  user: Pick<
    UserRow,
    "id" | "first_name" | "last_name" | "display_name" | "gdg_id"
  > | null;
};

export class PortfolioRepository implements IPortfolioRepository {
  private readonly profileTable = "user_profile";
  private readonly userTable = "user";

  private readonly selectClause = `
    id,
    user_id,
    created_at,
    updated_at,
    bio,
    github_url,
    linkedin_url,
    portfolio_url,
    program,
    skills_summary,
    year_level,
    is_public,
    user:user_id (
      id,
      first_name,
      last_name,
      display_name,
      gdg_id
    )
  `;

  private toSkillsArray(value: string | null): string[] {
    if (!value) return [];
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  private toYearAndProgram(
    program: string | null,
    yearLevel: number | null,
  ): string | null {
    if (!program && (yearLevel === null || yearLevel === undefined))
      return null;
    if (yearLevel === null || yearLevel === undefined) return program;
    if (!program) return `${yearLevel}`;
    return `${yearLevel} - ${program}`;
  }

  private toYearLevel(yearAndProgram: string | null): number | null {
    if (!yearAndProgram) return null;
    const match = yearAndProgram.match(/\d+/);
    if (!match) return null;
    const parsed = Number(match[0]);
    return Number.isFinite(parsed) ? parsed : null;
  }

  private rowToPortfolio(row: PortfolioSelectRow): Portfolio {
    const user = row.user;
    const skills = this.toSkillsArray(row.skills_summary ?? null);

    return Portfolio.hydrate({
      id: row.id,
      userId: row.user_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,

      fullName:
        [user?.first_name, user?.last_name].filter(Boolean).join(" ") || null,
      nickname: user?.display_name ?? null,
      gdgId: user?.gdg_id ?? null,
      membershipType: null,
      department: null,
      yearAndProgram: this.toYearAndProgram(
        row.program ?? null,
        row.year_level ?? null,
      ),

      bio: row.bio ?? null,

      githubUrl: row.github_url ?? null,
      linkedinUrl: row.linkedin_url ?? null,
      portfolioWebsiteUrl: row.portfolio_url ?? null,
      otherLinks: [],

      technicalSkills: skills,
      learningInterests: [],
      toolsAndTechnologies: [],

      isPublic: row.is_public ?? false,
    });
  }

  async findById(portfolioId: string): Promise<Portfolio> {
    const { data, error } = await supabase
      .from(this.profileTable)
      .select(this.selectClause)
      .eq("id", portfolioId)
      .single();

    if (error || !data) {
      throw new NotFoundError(`Portfolio not found for ID: ${portfolioId}`);
    }

    return this.rowToPortfolio(data as PortfolioSelectRow);
  }

  async findByName(displayName: string): Promise<Portfolio> {
    const { data: userRow, error: userError } = await supabase
      .from(this.userTable)
      .select("id")
      .eq("display_name", displayName)
      .single();

    if (userError || !userRow) {
      throw new NotFoundError(`Portfolio not found for name: ${displayName}`);
    }

    const { data, error } = await supabase
      .from(this.profileTable)
      .select(this.selectClause)
      .eq("user_id", userRow.id)
      .single();

    if (error || !data) {
      throw new NotFoundError(`Portfolio not found for name: ${displayName}`);
    }

    return this.rowToPortfolio(data as PortfolioSelectRow);
  }

  async findByGdgId(gdgId: string): Promise<Portfolio> {
    const { data: userRow, error: userError } = await supabase
      .from(this.userTable)
      .select("id")
      .eq("gdg_id", gdgId)
      .single();

    if (userError || !userRow) {
      throw new NotFoundError(`Portfolio not found for GDG ID: ${gdgId}`);
    }

    const { data, error } = await supabase
      .from(this.profileTable)
      .select(this.selectClause)
      .eq("user_id", userRow.id)
      .single();

    if (error || !data) {
      throw new NotFoundError(`Portfolio not found for GDG ID: ${gdgId}`);
    }

    return this.rowToPortfolio(data as PortfolioSelectRow);
  }

  async listPortfolios(
    pageNumber: number,
    pageSize: number,
  ): Promise<{ list: Portfolio[]; count: number }> {
    const from = (pageNumber - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from(this.profileTable)
      .select(this.selectClause, { count: "exact" })
      .range(from, to);

    if (error) {
      throw new InternalServerError("Failed to list portfolios.", error);
    }

    return {
      list:
        (data as PortfolioSelectRow[] | null)?.map((row) =>
          this.rowToPortfolio(row),
        ) ?? [],
      count: count ?? 0,
    };
  }

  async persistUpdates(portfolio: Portfolio): Promise<Portfolio> {
    const {
      id,
      bio,
      githubUrl,
      linkedinUrl,
      portfolioWebsiteUrl,
      technicalSkills,
      learningInterests,
      toolsAndTechnologies,
      yearAndProgram,
      isPublic,
    } = portfolio.props;

    const mergedSkills = Array.from(
      new Set([
        ...technicalSkills,
        ...learningInterests,
        ...toolsAndTechnologies,
      ]),
    );
    const skillsSummary =
      mergedSkills.length > 0 ? mergedSkills.join(", ") : null;
    const yearLevel = this.toYearLevel(yearAndProgram);

    const { error } = await supabase
      .from(this.profileTable)
      .update({
        bio,
        github_url: githubUrl,
        linkedin_url: linkedinUrl,
        portfolio_url: portfolioWebsiteUrl,
        program: yearAndProgram,
        skills_summary: skillsSummary,
        year_level: yearLevel,
        is_public: isPublic,
      })
      .eq("id", id);

    if (error) {
      throw new InternalServerError(`Failed to update portfolio ${id}.`, error);
    }

    return this.findById(id);
  }
}
