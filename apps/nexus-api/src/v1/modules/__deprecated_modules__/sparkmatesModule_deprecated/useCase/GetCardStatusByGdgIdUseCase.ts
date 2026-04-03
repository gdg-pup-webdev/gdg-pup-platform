import { ISparkmatesRepository } from "@/v1/modules/__deprecated_modules__/sparkmatesModule_deprecated/domain/ISparkmatesRepository";

export class GetCardStatusByGdgIdUseCase {
  constructor(private readonly repository: ISparkmatesRepository) {}

  async execute(gdgId: string) {
    return this.repository.getCardStateByGdgId(gdgId);
  }
}
