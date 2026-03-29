import { GdgMember } from "../domain/GdgMember";
import { IGdgMemberRepository } from "../domain/IGdgMemberRepository";

export class SearchMember {
  constructor(private readonly userRepository: IGdgMemberRepository) {}

  async execute(query: string, limit: number = 10): Promise<GdgMember[]> {
    if (!query) return [];
    return await this.userRepository.search(query, limit);
  }
}
