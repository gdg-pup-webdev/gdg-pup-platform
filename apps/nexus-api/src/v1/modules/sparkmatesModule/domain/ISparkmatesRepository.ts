import {
  SparkmatesBulkRegistrationResult,
  SparkmatesCardRegistration,
  SparkmatesCardState,
  SparkmatesPublicPortfolio,
  SparkmatesSource,
} from "@/v1/modules/sparkmatesModule/domain/Sparkmates";

export abstract class ISparkmatesRepository {
  abstract getCardStateByGdgId(gdgId: string): Promise<SparkmatesCardState>;

  abstract activateCardByGdgId(
    gdgId: string,
    actorUserId: string,
  ): Promise<SparkmatesCardState>;

  abstract registerCardByGdgId(input: {
    gdgId: string;
    ownerUserId?: string | null;
    notes?: string | null;
  }): Promise<SparkmatesCardRegistration>;

  abstract registerCardsBulk(input: {
    cards: Array<{
      gdgId: string;
      ownerUserId?: string | null;
      notes?: string | null;
    }>;
  }): Promise<SparkmatesBulkRegistrationResult>;

  abstract getPortfolioByGdgId(
    gdgId: string,
  ): Promise<SparkmatesPublicPortfolio>;

  abstract trackSparkmatesVisit(input: {
    gdgId: string;
    source: SparkmatesSource;
    userAgent: string | null;
  }): Promise<void>;
}
