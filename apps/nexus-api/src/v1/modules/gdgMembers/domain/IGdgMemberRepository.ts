import { GdgMember } from "./GdgMember";

export interface GdgMemberFilters {
  search?: string;
  program?: string;
  department?: string;
}

export interface IGdgMemberRepository {
  findById(id: string): Promise<GdgMember | null>;
  findByGdgId(gdgId: string): Promise<GdgMember | null>;
  findAll(pageNumber: number, pageSize: number, filters?: GdgMemberFilters): Promise<{ list: GdgMember[]; count: number }>;
  saveNew(member: GdgMember): Promise<GdgMember>;
  persistUpdates(member: GdgMember): Promise<GdgMember>;
  delete(id: string): Promise<void>;
  getHighestIdNumberForYear(yearPrefix: string): Promise<number>;
}
