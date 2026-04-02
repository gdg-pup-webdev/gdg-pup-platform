import { IMemberShowcaseRepository, MemberShowcaseFilters } from "../domain/IMemberShowcaseRepository";
import { MemberShowcase } from "../domain/MemberShowcase";

export class ListMemberShowcases {
  constructor(private readonly repo: IMemberShowcaseRepository) {}

  async execute(pageNumber: number, pageSize: number, filters?: MemberShowcaseFilters): Promise<{ list: MemberShowcase[]; count: number }> {
    return await this.repo.findAll(pageNumber, pageSize, filters);
  }
}
