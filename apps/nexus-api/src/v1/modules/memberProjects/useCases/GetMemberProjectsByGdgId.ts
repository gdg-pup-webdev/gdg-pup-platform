import { MemberProject } from "../domain/MemberProject";
import { IMemberProjectRepository } from "../domain/IMemberProjectRepository";

export class GetMemberProjectsByGdgId {
  constructor(private repository: IMemberProjectRepository) {}

  async execute(memberGdgId: string, page: number, limit: number): Promise<{ list: MemberProject[]; count: number }> {
    return await this.repository.findByMemberGdgId(memberGdgId, page, limit);
  }
}
