import {
  ConflictError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
} from "@/v1/errors/HttpError";
import { handlePostgresError } from "@/v1/lib/supabase.utils";
import { supabase } from "@/v1/lib/supabase";
import { ISparkmatesRepository } from "@/v1/modules/__deprecated_modules__/sparkmatesModule_deprecated/domain/ISparkmatesRepository";
import {
  SparkmatesBulkRegistrationResult,
  SparkmatesCardRegistration,
  SparkmatesCardState,
  SparkmatesPublicPortfolio,
  SparkmatesSource,
} from "@/v1/modules/__deprecated_modules__/sparkmatesModule_deprecated/domain/Sparkmates";
import { ISparkmatesPortfolioService } from "../domain/ISparkmatesPortfolioService";

export class SparkmatesRepository implements ISparkmatesRepository {
  private readonly nfcTable = "nfc_cards";

  constructor(private readonly portfolioService: ISparkmatesPortfolioService) {}

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
 
    const isPublic = await this.portfolioService.getPortfolioVisibilityByGdgId(gdgId);

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
    // const userId = await this.portfolioService.getUserIdByGdgId(gdgId);

    // if (userId !== actorUserId) {
    //   throw new ForbiddenError(
    //     `User ${actorUserId} does not own Sparkmates card for GDG ID: ${gdgId}`,
    //   );
    // }

    await this.portfolioService.setPortfolioVisibilityByGdgId(gdgId, true);

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

  async getPortfolioByGdgId(gdgId: string): Promise<SparkmatesPublicPortfolio> {
    return await this.portfolioService.getPortfolioByGdgId(gdgId);
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

    // Use portfolio service to get or validate user ID
    // let ownerUserId = input.ownerUserId;
    // if (!ownerUserId) {
    //     ownerUserId = await this.portfolioService.getUserIdByGdgId(input.gdgId);
    // } else {
    //     // Just checking if portfolio exists for this user would be good
    //     // But the original code was checking if user exists by ID.
    //     // We'll stick to getUserIdByGdgId or similar if we wanted to be strict.
    //     // For simplicity and to follow instructions, we rely on the portfolio service.
    // }

    const { data, error } = await nfcClient
      .from(this.nfcTable)
      .insert({
        gdg_id: input.gdgId, 
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
