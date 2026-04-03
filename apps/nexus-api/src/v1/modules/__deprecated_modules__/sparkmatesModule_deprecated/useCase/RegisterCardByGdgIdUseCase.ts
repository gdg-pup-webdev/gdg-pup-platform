import { ISparkmatesRepository } from "@/v1/modules/__deprecated_modules__/sparkmatesModule_deprecated/domain/ISparkmatesRepository";

export class RegisterCardByGdgIdUseCase {
  constructor(private readonly repository: ISparkmatesRepository) {}

  async execute(input: {
    gdgId: string;
    ownerUserId?: string | null;
    notes?: string | null;
  }) {
    return this.repository.registerCardByGdgId(input);
  }
}
