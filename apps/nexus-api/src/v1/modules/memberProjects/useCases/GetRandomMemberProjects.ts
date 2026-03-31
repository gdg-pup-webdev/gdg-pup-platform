import { IMemberProjectRepository } from "../domain/IMemberProjectRepository";
import { MemberProject } from "../domain/MemberProject";

export class GetRandomMemberProjects {
  constructor(private readonly repo: IMemberProjectRepository) {}

  async execute(page: number = 1, limit: number = 10): Promise<{ list: MemberProject[]; count: number }> {
    return await this.repo.findRandom(page, limit);
  }
}
