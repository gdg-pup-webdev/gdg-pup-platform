import { MemberProject } from "../domain/MemberProject";
import { IMemberProjectRepository } from "../domain/IMemberProjectRepository";
import { NotFoundError } from "@/v1/errors/HttpError";

export class GetMemberProject {
  constructor(private repository: IMemberProjectRepository) {}

  async execute(id: string): Promise<MemberProject> {
    const project = await this.repository.findById(id);
    if (!project) {
      throw new NotFoundError(`Member Project with ID ${id} not found`);
    }
    return project;
  }
}
