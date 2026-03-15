import {
  ConflictError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
} from "@/v1/errors/HttpError";
import { handlePostgresError } from "@/v1/lib/supabase.utils";
import { supabase } from "@/v1/lib/supabase";
import { ISparkmatesRepository } from "@/v1/modules/sparkmatesModule/domain/ISparkmatesRepository";
import { Tables } from "@/v1/types/supabase.types";
import {
  SparkmatesBulkRegistrationResult,
  SparkmatesCardRegistration,
  SparkmatesCardState,
  SparkmatesPublicPortfolio,
  SparkmatesSource,
} from "@/v1/modules/sparkmatesModule/domain/Sparkmates";

type UserProfileRow = Tables<"user_profile">;
type UserRow = Tables<"user">;

type SparkmatesPortfolioSelectRow = UserProfileRow & {
  user: Pick<
    UserRow,
    "id" | "first_name" | "last_name" | "display_name" | "gdg_id"
  > | null;
};

export class SparkmatesRepository implements ISparkmatesRepository {
  private readonly profileTable = "user_profile";
  private readonly userTable = "user";
  private readonly nfcTable = "nfc_cards";
  private readonly publicPortfolioSelectClause = `
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
    if (!value) {
      return [];
    }

    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

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

  private rowToPublicPortfolio(
    row: SparkmatesPortfolioSelectRow,
  ): SparkmatesPublicPortfolio {
    const user = row.user;
    const skills = this.toSkillsArray(row.skills_summary ?? null);

    return {
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
    };
  }

  private async getProfileVisibilityByUserId(
    userId: string,
  ): Promise<boolean | null> {
    const { data, error } = await supabase
      .from(this.profileTable)
      .select("is_public")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(1);

    if (error) {
      handlePostgresError(error);
    }

    const firstRow = data?.[0];
    if (!firstRow) {
      return null;
    }

    return Boolean(firstRow.is_public);
  }

  private async getUserIdByGdgId(gdgId: string): Promise<string> {
    const { data, error } = await supabase
      .from(this.userTable)
      .select("id")
      .eq("gdg_id", gdgId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        throw new NotFoundError(`User not found for GDG ID: ${gdgId}`);
      }
      handlePostgresError(error);
    }

    if (!data) {
      throw new NotFoundError(`User not found for GDG ID: ${gdgId}`);
    }

    return data.id;
  }

  async getCardStateByGdgId(gdgId: string): Promise<SparkmatesCardState> {
    const nfcClient = supabase as unknown as {
      from: (table: string) => {
        select: (columns: string) => {
          eq: (
            column: string,
            value: string,
          ) => {
            maybeSingle: () => Promise<{
              data: { status: SparkmatesCardState["status"] } | null;
              error: any;
            }>;
          };
        };
      };
    };

    const { data: nfcData, error: nfcError } = await nfcClient
      .from(this.nfcTable)
      .select("status")
      .eq("gdg_id", gdgId)
      .maybeSingle();

    const userId = await this.getUserIdByGdgId(gdgId);
    const isPublic = await this.getProfileVisibilityByUserId(userId);

    if (!nfcError && nfcData) {
      if (nfcData.status === "activated") {
        return {
          gdgId,
          status: isPublic ? "activated" : "issued",
          isPublic: Boolean(isPublic),
        };
      }

      return {
        gdgId,
        status: nfcData.status,
        isPublic: false,
      };
    }

    if (isPublic === null) {
      throw new NotFoundError(`Portfolio not found for GDG ID: ${gdgId}`);
    }

    return {
      gdgId,
      status: isPublic ? "activated" : "issued",
      isPublic,
    };
  }

  async activateCardByGdgId(
    gdgId: string,
    actorUserId: string,
  ): Promise<SparkmatesCardState> {
    const userId = await this.getUserIdByGdgId(gdgId);

    if (userId !== actorUserId) {
      throw new ForbiddenError(
        `User ${actorUserId} does not own Sparkmates card for GDG ID: ${gdgId}`,
      );
    }

    const currentVisibility = await this.getProfileVisibilityByUserId(userId);
    if (currentVisibility === null) {
      throw new NotFoundError(`Portfolio not found for GDG ID: ${gdgId}`);
    }

    const { error } = await supabase
      .from(this.profileTable)
      .update({ is_public: true })
      .eq("user_id", userId);

    if (error) {
      handlePostgresError(error);
    }

    const nfcClient = supabase as unknown as {
      from: (table: string) => {
        upsert: (
          payload: Record<string, unknown>,
          options: { onConflict: string },
        ) => Promise<{ error: any }>;
      };
    };

    const { error: nfcError } = await nfcClient.from(this.nfcTable).upsert(
      {
        gdg_id: gdgId,
        owner_user_id: userId,
        status: "activated",
        activated_at: new Date().toISOString(),
      },
      { onConflict: "gdg_id" },
    );

    if (nfcError) {
      throw new InternalServerError(
        "Failed to persist NFC activation state",
        nfcError,
      );
    }

    return {
      gdgId,
      status: "activated",
      isPublic: true,
    };
  }

  async getPublicPortfolioByGdgId(
    gdgId: string,
  ): Promise<SparkmatesPublicPortfolio> {
    const userId = await this.getUserIdByGdgId(gdgId);

    const { data, error } = await supabase
      .from(this.profileTable)
      .select(this.publicPortfolioSelectClause)
      .eq("user_id", userId)
      .eq("is_public", true)
      .order("updated_at", { ascending: false })
      .limit(1);

    if (error) {
      handlePostgresError(error);
    }

    const firstRow = data?.[0];
    if (!firstRow) {
      throw new NotFoundError(
        `Public portfolio not found for GDG ID: ${gdgId}`,
      );
    }

    return this.rowToPublicPortfolio(firstRow as SparkmatesPortfolioSelectRow);
  }

  private async userExistsById(userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from(this.userTable)
      .select("id")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      handlePostgresError(error);
    }

    return Boolean(data?.id);
  }

  private async resolveOwnerUserId(input: {
    gdgId: string;
    ownerUserId?: string | null;
  }): Promise<string | null> {
    if (!input.ownerUserId) {
      return this.getUserIdByGdgId(input.gdgId);
    }

    const exists = await this.userExistsById(input.ownerUserId);
    if (!exists) {
      throw new NotFoundError(`User not found for ID: ${input.ownerUserId}`);
    }

    return input.ownerUserId;
  }

  async registerCardByGdgId(input: {
    gdgId: string;
    ownerUserId?: string | null;
    notes?: string | null;
  }): Promise<SparkmatesCardRegistration> {
    const nfcClient = supabase as unknown as {
      from: (table: string) => {
        select: (columns: string) => {
          eq: (
            column: string,
            value: string,
          ) => {
            maybeSingle: () => Promise<{
              data: { gdg_id: string } | null;
              error: any;
            }>;
          };
        };
        insert: (payload: Record<string, unknown>) => {
          select: (columns: string) => {
            single: () => Promise<{
              data: {
                gdg_id: string;
                owner_user_id: string | null;
                status: SparkmatesCardRegistration["status"];
              } | null;
              error: any;
            }>;
          };
        };
      };
    };

    const { data: existing, error: existingError } = await nfcClient
      .from(this.nfcTable)
      .select("gdg_id")
      .eq("gdg_id", input.gdgId)
      .maybeSingle();

    if (existingError) {
      throw new InternalServerError(
        "Failed to validate existing NFC registration",
        existingError,
      );
    }

    if (existing) {
      throw new ConflictError(
        `NFC card already registered for GDG ID: ${input.gdgId}`,
      );
    }

    const ownerUserId = await this.resolveOwnerUserId(input);

    const { data, error } = await nfcClient
      .from(this.nfcTable)
      .insert({
        gdg_id: input.gdgId,
        owner_user_id: ownerUserId,
        status: "issued",
        notes: input.notes ?? null,
      })
      .select("gdg_id, owner_user_id, status")
      .single();

    if (error) {
      throw new InternalServerError("Failed to register NFC card", error);
    }

    if (!data) {
      throw new InternalServerError("Failed to register NFC card");
    }

    return {
      gdgId: data.gdg_id,
      ownerUserId: data.owner_user_id,
      status: data.status,
    };
  }

  async registerCardsBulk(input: {
    cards: Array<{
      gdgId: string;
      ownerUserId?: string | null;
      notes?: string | null;
    }>;
  }): Promise<SparkmatesBulkRegistrationResult> {
    const registered: SparkmatesBulkRegistrationResult["registered"] = [];
    const failed: SparkmatesBulkRegistrationResult["failed"] = [];

    for (const card of input.cards) {
      try {
        const result = await this.registerCardByGdgId(card);
        registered.push(result);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unexpected bulk registration error";

        failed.push({
          gdgId: card.gdgId,
          error: message,
        });
      }
    }

    return { registered, failed };
  }

  async trackSparkmatesVisit(input: {
    gdgId: string;
    source: SparkmatesSource;
    userAgent: string | null;
  }): Promise<void> {
    const analyticsClient = supabase as unknown as {
      from: (table: string) => {
        insert: (payload: Record<string, unknown>) => Promise<{ error: any }>;
      };
    };

    const { error } = await analyticsClient
      .from("sparkmates_metric_events")
      .insert({
        gdg_id: input.gdgId,
        source: input.source,
        user_agent: input.userAgent,
      });

    if (error) {
      throw new InternalServerError("Failed to track Sparkmates visit", error);
    }
  }
}
