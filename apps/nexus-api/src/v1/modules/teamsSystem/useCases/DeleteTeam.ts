import { ITeamRepository } from "../domain/ITeamRepository";

export class DeleteTeam {
  constructor(private readonly repo: ITeamRepository) {}

  async execute(id: string): Promise<boolean> {
    const team = await this.repo.findById(id);
    if (!team) throw new Error(`Cannot delete: Team with ID ${id} not found.`);
    
    await this.repo.delete(id);
    return true;
  }
}