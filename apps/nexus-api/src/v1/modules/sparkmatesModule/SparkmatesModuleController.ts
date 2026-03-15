import {
  SparkmatesBulkRegistrationResult,
  SparkmatesCardRegistration,
  SparkmatesCardStatus,
  SparkmatesPublicPortfolio,
  SparkmatesPublicRecord,
  SparkmatesSource,
} from "@/v1/modules/sparkmatesModule/domain/Sparkmates";
import { ActivateCardByGdgIdUseCase } from "@/v1/modules/sparkmatesModule/useCase/ActivateCardByGdgIdUseCase";
import { GetCardStatusByGdgIdUseCase } from "@/v1/modules/sparkmatesModule/useCase/GetCardStatusByGdgIdUseCase";
import { GetSparkmateByGdgIdUseCase } from "@/v1/modules/sparkmatesModule/useCase/GetSparkmateByGdgIdUseCase";
import { RegisterCardByGdgIdUseCase } from "@/v1/modules/sparkmatesModule/useCase/RegisterCardByGdgIdUseCase";
import { RegisterCardsBulkUseCase } from "@/v1/modules/sparkmatesModule/useCase/RegisterCardsBulkUseCase";

export type SparkmatesCardStateDTO = {
  gdgId: string;
  ownerUserId: string;
  status: SparkmatesCardStatus;
  isPublic: boolean;
};

export type SparkmatesPublicRecordDTO = {
  gdgId: string;
  ownerUserId: string;
  source: SparkmatesSource;
  status: SparkmatesCardStatus;
  portfolio: SparkmatesPublicPortfolio | null;
};

export type SparkmatesCardRegistrationDTO = SparkmatesCardRegistration;
export type SparkmatesBulkRegistrationResultDTO =
  SparkmatesBulkRegistrationResult;

export class SparkmatesModuleController {
  constructor(
    private readonly getCardStatusByGdgIdUseCase: GetCardStatusByGdgIdUseCase,
    private readonly activateCardByGdgIdUseCase: ActivateCardByGdgIdUseCase,
    private readonly getSparkmateByGdgIdUseCase: GetSparkmateByGdgIdUseCase,
    private readonly registerCardByGdgIdUseCase: RegisterCardByGdgIdUseCase,
    private readonly registerCardsBulkUseCase: RegisterCardsBulkUseCase,
  ) {}

  async getCardStatusByGdgId(gdgId: string): Promise<SparkmatesCardStateDTO> {
    return this.getCardStatusByGdgIdUseCase.execute(gdgId);
  }

  async activateCardByGdgId(
    gdgId: string,
    actorUserId: string,
  ): Promise<SparkmatesCardStateDTO> {
    return this.activateCardByGdgIdUseCase.execute(gdgId, actorUserId);
  }

  async registerCardByGdgId(input: {
    gdgId: string;
    ownerUserId?: string | null;
    notes?: string | null;
  }): Promise<SparkmatesCardRegistrationDTO> {
    return this.registerCardByGdgIdUseCase.execute(input);
  }

  async registerCardsBulk(input: {
    cards: Array<{
      gdgId: string;
      ownerUserId?: string | null;
      notes?: string | null;
    }>;
  }): Promise<SparkmatesBulkRegistrationResultDTO> {
    return this.registerCardsBulkUseCase.execute(input);
  }

  async getSparkmateByGdgId(input: {
    gdgId: string;
    source: SparkmatesSource;
    userAgent: string | null;
  }): Promise<SparkmatesPublicRecordDTO> {
    return this.getSparkmateByGdgIdUseCase.execute(input);
  }
}
