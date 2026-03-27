import { IMemberShowcaseRepository } from "../domain/IMemberShowcaseRepository";

export class DeleteMemberShowcase {
  constructor(private readonly repo: IMemberShowcaseRepository) {}

  async execute(id: string): Promise<void> {
    const memberShowcase = await this.repo.findById(id);
    if (!memberShowcase) {
      throw new Error("Member Showcase not found.");
    }
    await this.repo.delete(id);
  }
}
