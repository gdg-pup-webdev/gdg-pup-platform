import { GdgMember } from "../domain/GdgMember";
import {
  IGdgMemberRepository,
  GdgMemberFilters,
} from "../domain/IGdgMemberRepository";

export class MockGdgMemberRepository implements IGdgMemberRepository {
  private members: GdgMember[] = [];

  async findByGdgId(gdgId: string): Promise<GdgMember | null> {
    const member = this.members.find((m) => m.props.gdgId === gdgId);
    return member || null;
  }

  async findByEmail(email: string): Promise<GdgMember | null> {
    const member = this.members.find((m) => m.props.email === email);
    return member || null;
  }

  async findAll(
    pageNumber: number,
    pageSize: number,
    filters?: GdgMemberFilters,
  ): Promise<{ list: GdgMember[]; count: number }> {
    let filteredList = [...this.members];

    if (filters) {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredList = filteredList.filter(
          (m) =>
            m.props.firstName.toLowerCase().includes(searchLower) ||
            m.props.lastName.toLowerCase().includes(searchLower) ||
            m.props.email.toLowerCase().includes(searchLower),
        );
      }

      if (filters.program) {
        filteredList = filteredList.filter(
          (m) => m.props.program === filters.program,
        );
      }

      if (filters.department) {
        filteredList = filteredList.filter(
          (m) => m.props.department === filters.department,
        );
      }
    }

    const totalCount = filteredList.length;
    const startIndex = (pageNumber - 1) * pageSize;
    const paginatedList = filteredList.slice(startIndex, startIndex + pageSize);

    return {
      list: paginatedList,
      count: totalCount,
    };
  }

  async saveNew(member: GdgMember): Promise<GdgMember> {
    this.members.push(member);
    return member;
  }

  async persistUpdates(member: GdgMember): Promise<GdgMember> {
    const index = this.members.findIndex(
      (m) => m.props.gdgId === member.props.gdgId,
    );
    if (index !== -1) {
      this.members[index] = member;
    }
    return member;
  }

  async deleteByGdgId(gdgId: string): Promise<void> {
    this.members = this.members.filter((m) => m.props.gdgId !== gdgId);
  }

  async getHighestIdNumberForYear(yearPrefix: string): Promise<number> {
    // Assumes gdgId format like "2024-0001"
    const idsForYear = this.members
      .filter((m) => m.props.gdgId.startsWith(yearPrefix))
      .map((m) => {
        const parts = m.props.gdgId.split("-");
        return parts.length > 1 ? parseInt(parts[1], 10) : 0;
      });

    return idsForYear.length > 0 ? Math.max(...idsForYear) : 0;
  }

  // Helper method for testing to seed data
  __seed(members: GdgMember[]): void {
    this.members = [...members];
  }
}
