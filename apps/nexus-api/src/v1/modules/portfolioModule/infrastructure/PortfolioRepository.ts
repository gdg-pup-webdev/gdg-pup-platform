import { NotFoundError, InternalServerError } from "@/v1/errors/HttpError";
import { supabase } from "@/v1/lib/supabase";
import { Tables, TablesUpdate } from "@/v1/types/supabase.types";
import { IPortfolioRepository } from "@/v1/modules/portfolioModule/domain/IPortfolioRepository";
import {
  Portfolio,
  PortfolioProps,
} from "@/v1/modules/portfolioModule/domain/Portfolio";

type GdgMemberRow = Tables<"gdg_members">;
type UserRow = Tables<"user">;
type UserProfileRow = Tables<"user_profile">;

type PortfolioSelectRow = GdgMemberRow & {
  user: (UserRow & {
    profile: UserProfileRow[] | null;
  })[] | null;
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
  private readonly memberTable = "gdg_members";
  private readonly userTable = "user";
  private readonly profileTable = "user_profile";

  private readonly selectClause = `
    *,
    user:user!user_gdg_id_fkey (
      *,
      profile:user_profile(*)
    )
  `;

  private rowToPortfolio(row: PortfolioSelectRow): Portfolio {
    const userRow = row.user?.[0] || null;
    const profileRow = userRow?.profile?.[0] || null;

    return Portfolio.hydrate({
      // We use gdg_members.id as the primary identifier for the portfolio
      id: row.id,
      userId: userRow?.id || row.id, // Fallback to member ID if no user record
      createdAt: profileRow?.created_at || row.created_at || new Date().toISOString(),
      updatedAt: profileRow?.updated_at || row.updated_at || new Date().toISOString(),

      // Personal Information - Fallback hierarchy: Profile -> User -> Member (Source of Truth)
      firstName: profileRow?.first_name || userRow?.first_name || row.first_name || null,
      middleName: profileRow?.middle_name || null,
      lastName: profileRow?.last_name || userRow?.last_name || row.last_name || null,
      nickname: profileRow?.nickname || userRow?.display_name || row.display_name || null,
      gdgId: row.gdg_id,
      
      membershipType: profileRow?.membership_type ?? null,
      department: profileRow?.department || row.department || null,
      yearLevel: profileRow?.year_level ?? null,
      program: profileRow?.program || row.program || null,

      // Bio
      bio: profileRow?.bio ?? null,

      // Socials
      githubUrl: profileRow?.github_url ?? null,
      linkedinUrl: profileRow?.linkedin_url ?? null,
      portfolioWebsiteUrl: profileRow?.portfolio_url ?? null,
      otherLinks: profileRow?.other_links ?? [],

      // Skills & Interests
      technicalSkills: profileRow?.technical_skills ?? [],
      learningInterests: profileRow?.learning_interests ?? [],
      toolsAndTechnologies: profileRow?.tools_and_technologies ?? [],

      isPublic: profileRow?.is_public ?? false,
      profileImage: profileRow?.profile_image ?? userRow?.avatar_url ?? null,
    });
  }
  
  async findById(portfolioId: string): Promise<Portfolio> {
    const { data, error } = await supabase
      .from(this.memberTable)
      .select(this.selectClause)
      .eq("id", portfolioId)
      .single();

    if (error || !data) {
      throw new NotFoundError(`Portfolio not found for ID: ${portfolioId}`);
    }

    return this.rowToPortfolio(data as PortfolioSelectRow);
  }

  async findByName(displayName: string): Promise<Portfolio> {
    const { data, error } = await supabase
      .from(this.memberTable)
      .select(this.selectClause)
      .eq("display_name", displayName)
      .single();

    if (error || !data) {
      throw new NotFoundError(`Portfolio not found for name: ${displayName}`);
    }

    return this.rowToPortfolio(data as PortfolioSelectRow);
  }

  async findByGdgId(gdgId: string): Promise<Portfolio> {
    console.log(`Finding portfolio by GDG ID: ${gdgId}`);

    const { data, error } = await supabase
      .from(this.memberTable)
      .select("*")
      .eq("gdg_id", gdgId)
      .single();

    if (error) {
      console.error(`Error finding portfolio for GDG ID ${gdgId}:`, error);
    }

    if (error || !data) {
      throw new NotFoundError(`Portfolio not found for GDG ID: ${gdgId}`);
    }

    console.log(`Found portfolio for GDG ID ${gdgId}:`, data);

    return this.rowToPortfolio(data as PortfolioSelectRow);
  }

  async listPortfolios(
    pageNumber: number,
    pageSize: number,
  ): Promise<{ list: Portfolio[]; count: number }> {
    const from = (pageNumber - 1) * pageSize;
    const { data, error, count } = await supabase
      .from(this.memberTable)
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
    const { id, gdgId, ...props } = portfolio.props;

    if (!gdgId) {
        throw new InternalServerError("Cannot update portfolio: GDG ID is missing.");
    }

    // We need to find the profile record.
    // Since we use gdg_members as source of truth, we resolve the profile via gdg_id
    const { data: memberData, error: memberError } = await supabase
      .from(this.memberTable)
      .select(this.selectClause)
      .eq("gdg_id", gdgId)
      .single();

    if (memberError || !memberData) {
      throw new NotFoundError(`Cannot update portfolio: Member not found for GDG ID ${gdgId}`);
    }

    const castedData = memberData as PortfolioSelectRow;
    const profileRow = castedData.user?.[0]?.profile?.[0];

    if (!profileRow) {
      throw new InternalServerError(`Cannot update portfolio: User profile not found for member ${gdgId}. Users must register before updating profiles.`);
    }

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
      .eq("id", profileRow.id);

    if (error) {
      throw new InternalServerError(`Failed to update portfolio for member ${gdgId}.`, error);
    }

    return this.findById(id);
  }
}
