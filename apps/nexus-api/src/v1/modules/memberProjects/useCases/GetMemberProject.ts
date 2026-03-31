import { MemberProject } from "../domain/MemberProject";
import { IMemberProjectRepository } from "../domain/IMemberProjectRepository";

export class GetMemberProject {
  constructor(private repository: IMemberProjectRepository) {}

  async execute(id: string): Promise<MemberProject> {
    const project = await this.repository.findById(id);
    if (!project) {
      throw new Error(`Member Project with ID ${id} not found`);
    }
    return project;
  }
}
