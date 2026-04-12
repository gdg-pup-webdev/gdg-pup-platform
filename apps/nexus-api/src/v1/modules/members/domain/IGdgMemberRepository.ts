import { GdgMember } from "./GdgMember";

export interface GdgMemberFilters {
  search?: string;
  program?: string;
  department?: string;
}

export interface IGdgMemberRepository {
  findByGdgId(gdgId: string): Promise<GdgMember | null>;
  findByEmail(email: string): Promise<GdgMember | null>;
  findAll(
    pageNumber: number,
    pageSize: number,
    filters?: GdgMemberFilters,
  ): Promise<{ list: GdgMember[]; count: number }>;

  findSimilarMembersBasedOnField(
    memberGdgId: string,
    fieldName: string, 
    fieldValue: string | number | string[] | null,
    pageNumber: number,
    pageSize: number,
  ): Promise<{ list: GdgMember[]; count: number }>;

  listRandomMembers(pageNumber: number, pageSize: number, seed: number): Promise<{ list: GdgMember[]; count: number }>;

  //
  findPublicMembersExcludingGdgId(
    gdgId: string,
    limit?: number,
  ): Promise<GdgMember[]>;
  findPublicMembersWithSameProgramOrDepartmentExcludingGdgId(
    gdgId: string,
    filters: {
      program: string | null;
      department: string | null;
    },
    limit?: number,
  ): Promise<GdgMember[]>;
  findPublicMembersWithSameYearLevelExcludingGdgId(
    gdgId: string,
    yearLevel: number | null,
    limit?: number,
  ): Promise<GdgMember[]>;
  findPublicSimilarMembersExcludingGdgId(
    gdgId: string,
    filters: {
      program: string | null;
      department: string | null;
      yearLevel: number | null;
      technicalSkills: string[];
      learningInterests: string[];
      toolsAndTechnologies: string[];
    },
    limit?: number,
  ): Promise<GdgMember[]>;
  //

  saveNew(member: GdgMember): Promise<GdgMember>;
  persistUpdates(member: GdgMember): Promise<GdgMember>;
  deleteByGdgId(gdgId: string): Promise<void>;
  getHighestIdNumberForYear(yearPrefix: string): Promise<number>;
  search(query: string, limit: number): Promise<GdgMember[]>;
}
