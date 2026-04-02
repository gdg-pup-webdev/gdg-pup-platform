import { NotFoundError, InternalServerError } from "@/v1/errors/HttpError";
import { supabase } from "@/v1/lib/supabase";
import { Tables, TablesUpdate } from "@/v1/types/supabase.types";
import { IPortfolioRepository } from "@/v1/modules/portfolioModule_deprecated/domain/IPortfolioRepository";
import {
  Portfolio,
  PortfolioProps,
} from "@/v1/modules/portfolioModule_deprecated/domain/Portfolio";

type UserPortfolioRow = Tables<"user_portfolio">;


/**
 * Maps PortfolioProps (camelCase) to user_profile DB columns (snake_case).
 * This configuration centralizes field mapping and reduces hardcoding in implementation.
 */
const PROFILE_COLUMN_MAPPING: Record<string, keyof UserPortfolioRow> = {
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
  private readonly profileTable = "user_portfolio";


  private rowToPortfolio(row: UserPortfolioRow): Portfolio {  

    return Portfolio.hydrate({
      // We use gdg_members.id as the primary identifier for the portfolio
      id: row.id, 
      createdAt: row?.created_at   || new Date().toISOString(),
      updatedAt: row?.updated_at  || new Date().toISOString(),

      // Personal Information - Fallback hierarchy: Profile -> User -> Member (Source of Truth)
      firstName: row?.first_name   || null,
      middleName: row?.middle_name || null,
      lastName: row?.last_name  || null,
      nickname: row?.nickname || null,
      gdgId: row.gdg_id || "NO GDG ID",
      
      membershipType: row?.membership_type ?? null,
      department: row?.department  || null,
      yearLevel: row?.year_level ?? null,
      program: row?.program || null,

      // Bio
      bio: row?.bio ?? null,

      // Socials
      githubUrl: row?.github_url ?? null,
      linkedinUrl: row?.linkedin_url ?? null,
      portfolioWebsiteUrl: row?.portfolio_url ?? null,
      otherLinks: row?.other_links ?? [],

      // Skills & Interests
      technicalSkills: row?.technical_skills ?? [],
      learningInterests: row?.learning_interests ?? [],
      toolsAndTechnologies: row?.tools_and_technologies ?? [],

      isPublic: row?.is_public ?? false,
      profileImage: row?.profile_image ?? null,
    });
  }
  
  async findById(portfolioId: string): Promise<Portfolio> {
    const { data, error } = await supabase
      .from(this.profileTable)
      .select("*")
      .eq("id", portfolioId)
      .single();

    if (error || !data) {
      throw new NotFoundError(`Portfolio not found for ID: ${portfolioId}`);
    }

    return this.rowToPortfolio(data  );
  }

  async findByName(displayName: string): Promise<Portfolio> {
    const { data, error } = await supabase
      .from(this.profileTable)
      .select("*")
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

  async findByEmail(email: string): Promise<Portfolio> {
    console.log(`Finding portfolio by email: ${email}`);
    const { data, error } = await supabase
      .from(this.memberTable)
      .select(this.selectClause)
      .eq("email", email)
      .single();

    if (error) {
      console.error(`Error finding portfolio for email ${email}:`, error);
    }

    console.log(`Found portfolio for email ${email}:`, data);

    if (error || !data) {
      throw new NotFoundError(`Portfolio not found for email: ${email}`);
    }

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
