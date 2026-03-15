import { ISparkmatesRepository } from "@/v1/modules/sparkmatesModule/domain/ISparkmatesRepository";

export class RegisterCardsBulkUseCase {
  constructor(private readonly repository: ISparkmatesRepository) {}

  async execute(input: {
    cards: Array<{
      gdgId: string;
      ownerUserId?: string | null;
      notes?: string | null;
    }>;
  }) {
    return this.repository.registerCardsBulk(input);
  }
}
