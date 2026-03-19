import { ISparkmatesRepository } from "@/v1/modules/sparkmatesModule/domain/ISparkmatesRepository";

export class ActivateCardByGdgIdUseCase {
  constructor(private readonly repository: ISparkmatesRepository) {}

  async execute(gdgId: string, actorUserId: string) {
    return this.repository.activateCardByGdgId(gdgId, actorUserId);
  }
}
