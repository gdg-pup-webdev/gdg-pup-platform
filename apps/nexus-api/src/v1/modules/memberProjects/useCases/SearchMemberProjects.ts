import { IMemberProjectRepository } from "../domain/IMemberProjectRepository";
import { MemberProject } from "../domain/MemberProject";

export class SearchMemberProjects {
  constructor(private readonly repo: IMemberProjectRepository) {}

  async execute(query: string, page: number = 1, limit: number = 10): Promise<{ list: MemberProject[]; count: number }> {
    if (!query || query.trim().length === 0) {
      return await this.repo.findAll(page, limit);
    }
    return await this.repo.search(query, page, limit);
  }
}
