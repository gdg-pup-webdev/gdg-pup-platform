import { IGdgMemberRepository, GdgMemberFilters } from "../domain/IGdgMemberRepository";
import { GdgMember } from "../domain/GdgMember";

export class ListGdgMembers {
  constructor(private readonly repo: IGdgMemberRepository) {}

  async execute(pageNumber: number, pageSize: number, filters?: GdgMemberFilters): Promise<{ list: GdgMember[]; count: number }> {
    return await this.repo.findAll(pageNumber, pageSize, filters);
  }
}
