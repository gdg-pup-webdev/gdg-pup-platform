import { GdgMember } from "../domain/GdgMember";
import { IGdgMemberRepository, GdgMemberFilters } from "../domain/IGdgMemberRepository";

export class MockGdgMemberRepository implements IGdgMemberRepository {
  private members: Map<string, GdgMember> = new Map();

  async findById(id: string): Promise<GdgMember | null> {
    return this.members.get(id) || null;
  }

  async findByGdgId(gdgId: string): Promise<GdgMember | null> {
    return Array.from(this.members.values()).find(m => m.props.gdgId === gdgId) || null;
  }

  async findByEmail(email: string): Promise<GdgMember | null> {
    return Array.from(this.members.values()).find(m => m.props.email === email) || null;
  }

  async findAll(pageNumber: number, pageSize: number, filters?: GdgMemberFilters): Promise<{ list: GdgMember[]; count: number }> {
    let list = Array.from(this.members.values());

    if (filters) {
      if (filters.search) {
        const s = filters.search.toLowerCase();
        list = list.filter(m => 
          m.props.displayName.toLowerCase().includes(s) || 
          m.props.email.toLowerCase().includes(s) ||
          m.props.firstName.toLowerCase().includes(s) ||
          m.props.lastName.toLowerCase().includes(s)
        );
      }
      if (filters.program) {
        list = list.filter(m => m.props.program === filters.program);
      }
      if (filters.department) {
        list = list.filter(m => m.props.department === filters.department);
      }
    }

    const start = (pageNumber - 1) * pageSize;
    return {
      list: list.slice(start, start + pageSize),
      count: list.length
    };
  }

  async saveNew(member: GdgMember): Promise<GdgMember> {
    this.members.set(member.props.id, member);
    return member;
  }

  async persistUpdates(member: GdgMember): Promise<GdgMember> {
    this.members.set(member.props.id, member);
    return member;
  }

  async delete(id: string): Promise<void> {
    this.members.delete(id);
  }

  async getHighestIdNumberForYear(yearPrefix: string): Promise<number> {
    let max = 0;
    const prefix = `GDGPUP-${yearPrefix}-`;
    for (const id of this.members.keys()) {
      if (id.startsWith(prefix)) {
        const numPart = id.replace(prefix, "");
        const num = parseInt(numPart, 10);
        if (num > max) max = num;
      }
    }
    return max;
  }
}
