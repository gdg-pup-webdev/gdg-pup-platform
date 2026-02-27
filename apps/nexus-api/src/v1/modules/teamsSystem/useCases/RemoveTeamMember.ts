import { ITeamMemberRepository } from "../domain/ITeamMemberRepository";

export class RemoveTeamMember {
  constructor(private readonly repo: ITeamMemberRepository) {}

  async execute(id: string): Promise<boolean> {
    const member = await this.repo.findById(id);
    if (!member) throw new Error(`Cannot remove: Team Member with ID ${id} not found.`);
    
    await this.repo.delete(id);
    return true;
  }
}