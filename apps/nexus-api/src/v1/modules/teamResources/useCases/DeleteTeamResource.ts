import { ITeamResourceRepository } from "../domain/ITeamResourceRepository";

export class DeleteTeamResource {
  constructor(private readonly repo: ITeamResourceRepository) {}

  async execute(id: string): Promise<void> {
    const resource = await this.repo.findById(id);
    if (!resource) {
      throw new Error("Team resource not found.");
    }
    await this.repo.delete(id);
  }
}
