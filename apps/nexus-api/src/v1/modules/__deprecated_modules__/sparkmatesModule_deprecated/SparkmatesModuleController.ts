import {
  SparkmatesBulkRegistrationResult,
  SparkmatesCardRegistration,
  SparkmatesCardStatus,
  SparkmatesPublicPortfolio,
  SparkmatesPublicRecord,
  SparkmatesSource,
} from "@/v1/modules/__deprecated_modules__/sparkmatesModule_deprecated/domain/Sparkmates";
import { ActivateCardByGdgIdUseCase } from "@/v1/modules/__deprecated_modules__/sparkmatesModule_deprecated/useCase/ActivateCardByGdgIdUseCase";
import { GetCardStatusByGdgIdUseCase } from "@/v1/modules/__deprecated_modules__/sparkmatesModule_deprecated/useCase/GetCardStatusByGdgIdUseCase";
import { GetSparkmateByGdgIdUseCase } from "@/v1/modules/__deprecated_modules__/sparkmatesModule_deprecated/useCase/GetSparkmateByGdgIdUseCase";
import { RegisterCardByGdgIdUseCase } from "@/v1/modules/__deprecated_modules__/sparkmatesModule_deprecated/useCase/RegisterCardByGdgIdUseCase";
import { RegisterCardsBulkUseCase } from "@/v1/modules/__deprecated_modules__/sparkmatesModule_deprecated/useCase/RegisterCardsBulkUseCase";

export type SparkmatesCardStateDTO = {
  gdgId: string; 
  status: SparkmatesCardStatus;
  isPublic: boolean;
};

export type SparkmatesPublicRecordDTO = {
  gdgId: string; 
  source: SparkmatesSource;
  status: SparkmatesCardStatus;
  portfolio: SparkmatesPublicPortfolio | null;
};

export type SparkmatesCardRegistrationDTO = SparkmatesCardRegistration;
export type SparkmatesBulkRegistrationResultDTO =
  SparkmatesBulkRegistrationResult;

  
/**
 * @deprecated
 */
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
    notes?: string | null;
  }): Promise<SparkmatesCardRegistrationDTO> {
    return this.registerCardByGdgIdUseCase.execute(input);
  }

  async registerCardsBulk(input: {
    cards: Array<{
      gdgId: string; 
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
