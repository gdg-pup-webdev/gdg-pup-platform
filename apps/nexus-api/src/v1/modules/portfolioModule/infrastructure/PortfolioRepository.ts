import { NotFoundError, InternalServerError } from "@/v1/errors/HttpError";
import { supabase } from "@/v1/lib/supabase";
import { Tables, TablesUpdate } from "@/v1/types/supabase.types";
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
    "id" | "first_name" | "last_name" | "display_name" | "gdg_id" | "avatar_url"
  > | null;
};

/**
 * Maps PortfolioProps (camelCase) to user_profile DB columns (snake_case).
 * This configuration centralizes field mapping and reduces hardcoding in implementation.
 */
const PROFILE_COLUMN_MAPPING: Record<string, keyof UserProfileRow> = {
  firstName: "first_name",
  middleName: "middle_name",
  lastName: "last_name",
  nickname: "nickname",
  membershipType: "membership_type",
  department: "department",
  yearLevel: "year_level",
  program: "program",
  bio: "bio",
  githubUrl: "github_url",
  linkedinUrl: "linkedin_url",
  portfolioWebsiteUrl: "portfolio_url",
  otherLinks: "other_links",
  technicalSkills: "technical_skills",
  learningInterests: "learning_interests",
  toolsAndTechnologies: "tools_and_technologies",
  isPublic: "is_public",
  profileImage: "profile_image",
};

export class PortfolioRepository implements IPortfolioRepository {
  private readonly profileTable = "user_profile";
  private readonly userTable = "user";

  private readonly selectClause = `
    *,
    user:user_id (
      id,
      first_name,
      last_name,
      display_name,
      gdg_id,
      avatar_url
    )
  `;

  private rowToPortfolio(row: PortfolioSelectRow): Portfolio {
    const { user, ...profile } = row;

    return Portfolio.hydrate({
      id: profile.id,
      userId: profile.user_id,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at,

      // Personal Information - Fallback to User table if Profile table fields are null (legacy compatibility)
      firstName: profile.first_name || user?.first_name || null,
      middleName: profile.middle_name ?? null,
      lastName: profile.last_name || user?.last_name || null,
      nickname: profile.nickname || user?.display_name || null,
      gdgId: user?.gdg_id ?? null,
      
      membershipType: profile.membership_type ?? null,
      department: profile.department ?? null,
      yearLevel: profile.year_level ?? null,
      program: profile.program ?? null,

      // Bio
      bio: profile.bio ?? null,

      // Socials
      githubUrl: profile.github_url ?? null,
      linkedinUrl: profile.linkedin_url ?? null,
      portfolioWebsiteUrl: profile.portfolio_url ?? null,
      otherLinks: profile.other_links ?? [],

      // Skills & Interests
      technicalSkills: profile.technical_skills ?? [],
      learningInterests: profile.learning_interests ?? [],
      toolsAndTechnologies: profile.tools_and_technologies ?? [],

      isPublic: profile.is_public ?? false,
      profileImage: profile.profile_image ?? user?.avatar_url ?? null,
    });
  }
  
  /**
   * Helper to fetch portfolio by a user_id found via other criteria.
   */
  private async findByUserId(userId: string, errorLabel: string): Promise<Portfolio> {
    const { data, error } = await supabase
      .from(this.profileTable)
      .select(this.selectClause)
      .eq("user_id", userId)
      .single();

    if (error || !data) {
      throw new NotFoundError(`Portfolio not found for ${errorLabel}`);
    }

    return this.rowToPortfolio(data as PortfolioSelectRow);
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

    return this.findByUserId(userRow.id, `name: ${displayName}`);
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

    return this.findByUserId(userRow.id, `GDG ID: ${gdgId}`);
  }

  async listPortfolios(
    pageNumber: number,
    pageSize: number,
  ): Promise<{ list: Portfolio[]; count: number }> {
    const from = (pageNumber - 1) * pageSize;
    const { data, error, count } = await supabase
      .from(this.profileTable)
      .select(this.selectClause, { count: "exact" })
      .range(from, from + pageSize - 1);

    if (error) {
      throw new InternalServerError("Failed to list portfolios.", error);
    }

    return {
      list: (data as PortfolioSelectRow[] | null)?.map((row) => this.rowToPortfolio(row)) ?? [],
      count: count ?? 0,
    };
  }

  async persistUpdates(portfolio: Portfolio): Promise<Portfolio> {
    const { id, ...props } = portfolio.props;

    // Dynamically build the update object using the column mapping
    const updatePayload: TablesUpdate<"user_profile"> = {};
    
    for (const [propKey, colName] of Object.entries(PROFILE_COLUMN_MAPPING)) {
        const val = (props as any)[propKey];
        if (val !== undefined) {
            (updatePayload as any)[colName] = val;
        }
    }

    const { error } = await supabase
      .from(this.profileTable)
      .update(updatePayload)
      .eq("id", id);

    if (error) {
      throw new InternalServerError(`Failed to update portfolio ${id}.`, error);
    }

    return this.findById(id);
  }
}
