import { IMemberShowcaseRepository, MemberShowcaseFilters } from "../domain/IMemberShowcaseRepository";
import { MemberShowcase } from "../domain/MemberShowcase";

export class MockMemberShowcaseRepository implements IMemberShowcaseRepository {
  private showcases: Map<string, MemberShowcase> = new Map();

  async findById(id: string): Promise<MemberShowcase | null> {
    return this.showcases.get(id) || null;
  }

  async findAll(pageNumber: number, pageSize: number, filters?: MemberShowcaseFilters): Promise<{ list: MemberShowcase[]; count: number }> {
    let list = Array.from(this.showcases.values());

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      list = list.filter(s => 
        s.props.title.toLowerCase().includes(search) || 
        s.props.description.toLowerCase().includes(search)
      );
    }

    const start = (pageNumber - 1) * pageSize;
    return {
      list: list.slice(start, start + pageSize),
      count: list.length,
    };
  }

  async saveNew(memberShowcase: MemberShowcase): Promise<MemberShowcase> {
    this.showcases.set(memberShowcase.props.id, memberShowcase);
    return memberShowcase;
  }

  async persistUpdates(memberShowcase: MemberShowcase): Promise<MemberShowcase> {
    this.showcases.set(memberShowcase.props.id, memberShowcase);
    return memberShowcase;
  }

  async delete(id: string): Promise<void> {
    this.showcases.delete(id);
  }

  async getSpotlightOfTheDay(): Promise<MemberShowcase | null> {
    if (this.showcases.size === 0) return null;
    return Array.from(this.showcases.values())[0];
  }
}
