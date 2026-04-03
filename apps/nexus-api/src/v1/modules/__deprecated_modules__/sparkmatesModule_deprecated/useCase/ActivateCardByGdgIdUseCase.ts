import { ISparkmatesRepository } from "@/v1/modules/__deprecated_modules__/sparkmatesModule_deprecated/domain/ISparkmatesRepository";

export class ActivateCardByGdgIdUseCase {
  constructor(private readonly repository: ISparkmatesRepository) {}

  async execute(gdgId: string, actorUserId: string) {
    return this.repository.activateCardByGdgId(gdgId, actorUserId);
  }
}
