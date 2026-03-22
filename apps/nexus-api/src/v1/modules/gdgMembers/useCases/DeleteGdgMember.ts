import { IGdgMemberRepository } from "../domain/IGdgMemberRepository";

export class DeleteGdgMember {
  constructor(private readonly repo: IGdgMemberRepository) {}

  async execute(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
