import { IGdgMemberRepository } from "../domain/IGdgMemberRepository";

export class MakeProfilePrivate {
  constructor(private readonly repo: IGdgMemberRepository) {}

  async execute(id: string): Promise<void> {
    const member = await this.repo.findByGdgId(id);
    
    if (!member) {
      throw new Error(`Member not found for ID: ${id}`);
    }

    member.makePortfolioPrivate();

    await this.repo.persistUpdates(member);
  }
}
