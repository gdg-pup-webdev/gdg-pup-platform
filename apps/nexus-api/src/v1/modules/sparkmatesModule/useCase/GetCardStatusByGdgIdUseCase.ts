import { ISparkmatesRepository } from "@/v1/modules/sparkmatesModule/domain/ISparkmatesRepository";

export class GetCardStatusByGdgIdUseCase {
  constructor(private readonly repository: ISparkmatesRepository) {}

  async execute(gdgId: string) {
    return this.repository.getCardStateByGdgId(gdgId);
  }
}
