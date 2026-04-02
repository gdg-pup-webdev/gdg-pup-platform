import { IMemberProjectRepository } from "../domain/IMemberProjectRepository";

export class DeleteMemberProject {
  constructor(private repository: IMemberProjectRepository) {}

  async execute(id: string): Promise<void> {
    const project = await this.repository.findById(id);
    if (!project) {
      throw new Error(`Member Project with ID ${id} not found`);
    }
    await this.repository.delete(id);
  }
}
