import { NotFoundError, InternalServerError } from "@/v1/errors/HttpError";
import { supabase } from "@/v1/lib/supabase";
import { IPortfolioRepository } from "../domain/IPortfolioRepository";
import { Portfolio, PortfolioProps } from "../domain/Portfolio";

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
    other_links,
    technical_skills,
    learning_interests,
    tools_and_technologies,
    membership_type,
    department,
    year_and_program,
    is_public,
    user:user_id (
      first_name,
      last_name,
      display_name,
      gdg_id
    )
  `;

  private rowToPortfolio(row: any): Portfolio {
    const user = row.user ?? {};
    return Portfolio.hydrate({
      id: row.id,
      userId: row.user_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,

      fullName:
        [user.first_name, user.last_name].filter(Boolean).join(" ") || null,
      nickname: user.display_name ?? null,
      gdgId: user.gdg_id ?? null,
      membershipType: row.membership_type ?? null,
      department: row.department ?? null,
      yearAndProgram: row.year_and_program ?? null,

      bio: row.bio ?? null,

      githubUrl: row.github_url ?? null,
      linkedinUrl: row.linkedin_url ?? null,
      portfolioWebsiteUrl: row.portfolio_url ?? null,
      otherLinks: row.other_links ?? [],

      technicalSkills: row.technical_skills ?? [],
      learningInterests: row.learning_interests ?? [],
      toolsAndTechnologies: row.tools_and_technologies ?? [],

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

    return this.rowToPortfolio(data);
  }

  async findByName(displayName: string): Promise<Portfolio> {
    const { data, error } = await supabase
      .from(this.profileTable)
      .select(this.selectClause)
      .eq("user.display_name", displayName)
      .single();

    if (error || !data) {
      throw new NotFoundError(`Portfolio not found for name: ${displayName}`);
    }

    return this.rowToPortfolio(data);
  }

  async findByGdgId(gdgId: string): Promise<Portfolio> {
    const { data, error } = await supabase
      .from(this.profileTable)
      .select(this.selectClause)
      .eq("user.gdg_id", gdgId)
      .single();

    if (error || !data) {
      throw new NotFoundError(`Portfolio not found for GDG ID: ${gdgId}`);
    }

    return this.rowToPortfolio(data);
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
      list: (data ?? []).map((row) => this.rowToPortfolio(row)),
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
      otherLinks,
      technicalSkills,
      learningInterests,
      toolsAndTechnologies,
      membershipType,
      department,
      yearAndProgram,
      isPublic,
    } = portfolio.props;

    const { error } = await supabase
      .from(this.profileTable)
      .update({
        bio,
        github_url: githubUrl,
        linkedin_url: linkedinUrl,
        portfolio_url: portfolioWebsiteUrl,
        other_links: otherLinks,
        technical_skills: technicalSkills,
        learning_interests: learningInterests,
        tools_and_technologies: toolsAndTechnologies,
        membership_type: membershipType,
        department,
        year_and_program: yearAndProgram,
        is_public: isPublic,
      })
      .eq("id", id);

    if (error) {
      throw new InternalServerError(`Failed to update portfolio ${id}.`, error);
    }

    return this.findById(id);
  }
}
