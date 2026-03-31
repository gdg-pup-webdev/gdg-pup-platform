import { MemberProject } from "../domain/MemberProject";
import { IMemberProjectRepository } from "../domain/IMemberProjectRepository";

export class ListMemberProjects {
  constructor(private repository: IMemberProjectRepository) {}

  async execute(page: number, limit: number): Promise<{ list: MemberProject[]; count: number }> {
    return await this.repository.findAll(page, limit);
  }
}
