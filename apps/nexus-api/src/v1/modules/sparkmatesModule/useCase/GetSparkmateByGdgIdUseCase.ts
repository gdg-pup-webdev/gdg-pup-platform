import { ISparkmatesRepository } from "@/v1/modules/sparkmatesModule/domain/ISparkmatesRepository";
import {
  SparkmatesPublicRecord,
  SparkmatesSource,
} from "@/v1/modules/sparkmatesModule/domain/Sparkmates";

export class GetSparkmateByGdgIdUseCase {
  constructor(private readonly repository: ISparkmatesRepository) {}

  async execute(input: {
    gdgId: string;
    source: SparkmatesSource;
    userAgent: string | null;
  }): Promise<SparkmatesPublicRecord> {
    const cardState = await this.repository.getCardStateByGdgId(input.gdgId);

    // Analytics tracking should not block user-facing responses.
    this.repository
      .trackSparkmatesVisit({
        gdgId: input.gdgId,
        source: input.source,
        userAgent: input.userAgent,
      })
      .catch(() => undefined);

    if (cardState.status !== "activated") {
      return {
        gdgId: input.gdgId,
        source: input.source,
        status: cardState.status,
        portfolio: null,
      };
    }

    const portfolio = await this.repository.getPublicPortfolioByGdgId(
      input.gdgId,
    );

    return {
      gdgId: input.gdgId,
      source: input.source,
      status: cardState.status,
      portfolio,
    };
  }
}
