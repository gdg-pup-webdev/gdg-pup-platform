import { ISparkmatesRepository } from "@/v1/modules/__deprecated_modules__/sparkmatesModule_deprecated/domain/ISparkmatesRepository";

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
