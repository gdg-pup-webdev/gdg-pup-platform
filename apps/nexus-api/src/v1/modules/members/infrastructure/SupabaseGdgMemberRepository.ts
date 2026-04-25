import { supabase } from "@/v1/lib/supabase";
import { GdgMember, SparkmatesSectionId } from "../domain/GdgMember";
import {
  IGdgMemberRepository,
  GdgMemberFilters,
} from "../domain/IGdgMemberRepository";
import { Tables, TablesInsert, TablesUpdate } from "@/v1/types/supabase.types";
import { handlePostgresError } from "@/v1/lib/supabase.utils";
import { string } from "zod";

type SimilarityMemberRow = Pick<
  Tables<"gdg_members">,
  | "gdg_id"
  | "email"
  | "membership_type"
  | "avatar_image_url"
  | "program"
  | "year_level"
  | "department"
  | "display_name"
  | "first_name"
  | "middle_name"
  | "last_name"
  | "suffix"
  | "technical_skills"
  | "learning_interests"
  | "tools_and_technologies"
  | "is_public"
>;

const DEFAULT_SPARKMATES_SECTION_ORDER: SparkmatesSectionId[] = [
  "customButtons",
  "skillsAndInterests",
  "projects",
  "gdgImpact",
  "badges",
];

const isSparkmatesSectionId = (value: string): value is SparkmatesSectionId => {
  return (DEFAULT_SPARKMATES_SECTION_ORDER as string[]).includes(value);
};

export class SupabaseGdgMemberRepository implements IGdgMemberRepository {
  private readonly tableName = "gdg_members";
  private readonly similarityProjection =
    "gdg_id,email,membership_type,avatar_image_url,program,year_level,department,display_name,first_name,middle_name,last_name,suffix,technical_skills,learning_interests,tools_and_technologies,is_public";

  private mapToDomain(row: Tables<"gdg_members">): GdgMember {
    return GdgMember.hydrate({
      gdgId: row.gdg_id || "",
      email: row.email || "",
      membershipType: row.membership_type || null,
      avatarUrl: row.avatar_image_url || null,
      avatarUrl64: row.avatar_image_url || null,
      avatarUrl512: row.avatar_image_url || null,
      program: row.program || null,
      yearLevel: row.year_level || null,
      department: row.department || null,
      displayName: row.display_name || null,
      firstName: row.first_name || "",
      middleName: row.middle_name || null,
      lastName: row.last_name || "",
      suffix: row.suffix || null,
      bio: row.bio || null,
      githubUrl: row.github_url || null,
      linkedinUrl: row.linkedin_url || null,
      portfolioWebsiteUrl: row.portfolio_url || null,
      otherLinks: row.other_links?.split(",") || [],
      technicalSkills: row.technical_skills?.split(",") || [],
      learningInterests: row.learning_interests?.split(",") || [],
      toolsAndTechnologies: row.tools_and_technologies?.split(",") || [],
      sectionOrder:
        row.section_order
          ?.split(",")
          .filter((item): item is SparkmatesSectionId =>
            isSparkmatesSectionId(item),
          ) || DEFAULT_SPARKMATES_SECTION_ORDER,
      isOnboarded: row.is_onboarded,
      isPublic: row.is_public,
    });
  }

  private mapToInsertDb(member: GdgMember): TablesInsert<"gdg_members"> {
    const p = member.props;
    return {
      gdg_id: p.gdgId,
      email: p.email,
      membership_type: p.membershipType,
      avatar_image_url: p.avatarUrl,
      program: p.program,
      year_level: p.yearLevel,
      department: p.department,
      display_name: p.displayName,
      first_name: p.firstName,
      middle_name: p.middleName,
      last_name: p.lastName,
      suffix: p.suffix,
      bio: p.bio,
      github_url: p.githubUrl,
      linkedin_url: p.linkedinUrl,
      portfolio_url: p.portfolioWebsiteUrl,
      other_links: p.otherLinks.join(","),
      technical_skills: p.technicalSkills.join(","),
      learning_interests: p.learningInterests.join(","),
      tools_and_technologies: p.toolsAndTechnologies.join(","),
      section_order: p.sectionOrder.join(","),
      is_onboarded: p.isOnboarded,
      is_public: p.isPublic,

      updated_at: new Date().toISOString(),
    };
  }

  private mapToUpdateDb(member: GdgMember): TablesUpdate<"gdg_members"> {
    const p = member.props;

    return {
      email: p.email,
      membership_type: p.membershipType,
      avatar_image_url: p.avatarUrl,
      program: p.program,
      year_level: p.yearLevel,
      department: p.department,
      display_name: p.displayName,
      first_name: p.firstName,
      middle_name: p.middleName,
      last_name: p.lastName,
      suffix: p.suffix,
      bio: p.bio,
      github_url: p.githubUrl,
      linkedin_url: p.linkedinUrl,
      portfolio_url: p.portfolioWebsiteUrl,
      other_links: p.otherLinks.join(","),
      technical_skills: p.technicalSkills.join(","),
      learning_interests: p.learningInterests.join(","),
      tools_and_technologies: p.toolsAndTechnologies.join(","),
      section_order: p.sectionOrder.join(","),
      // Null means "no onboarding-state change" on update.
      is_onboarded: p.isOnboarded ?? undefined,
      // Null means "no visibility change" on update.
      is_public: p.isPublic ?? undefined,
      updated_at: new Date().toISOString(),
    };
  }

  private mapSimilarityToDomain(row: SimilarityMemberRow): GdgMember {
    return GdgMember.hydrate({
      gdgId: row.gdg_id || "",
      email: row.email || "",
      membershipType: row.membership_type ?? null,
      avatarUrl: row.avatar_image_url ?? null,
      avatarUrl64: row.avatar_image_url ?? null,
      avatarUrl512: row.avatar_image_url ?? null,
      program: row.program ?? null,
      yearLevel: row.year_level ?? null,
      department: row.department ?? null,
      displayName: row.display_name ?? null,
      firstName: row.first_name || "",
      middleName: row.middle_name ?? null,
      lastName: row.last_name || "",
      suffix: row.suffix ?? null,
      bio: null,
      githubUrl: null,
      linkedinUrl: null,
      portfolioWebsiteUrl: null,
      otherLinks: [],
      technicalSkills: row.technical_skills?.split(",") || [],
      learningInterests: row.learning_interests?.split(",") || [],
      toolsAndTechnologies: row.tools_and_technologies?.split(",") || [],
      sectionOrder: DEFAULT_SPARKMATES_SECTION_ORDER,
      isPublic: row.is_public || false,
      isOnboarded: false,
    });
  }

  async listRandomMembers(
    pageNumber: number,
    pageSize: number,
    seed: number,
  ): Promise<{ list: GdgMember[]; count: number }> {
    const from = (pageNumber - 1) * pageSize;
    const to = from + pageSize;
    const fetchLimit = Math.max(to * 2, 120);

    const normalizedSeed = Math.abs(seed) || 1;

    const seededHash = (value: string): number => {
      let hash = 0;
      const input = `${normalizedSeed}:${value}`;

      for (let index = 0; index < input.length; index += 1) {
        hash = (hash * 31 + input.charCodeAt(index)) >>> 0;
      }

      return hash;
    };

    const { data, count, error } = await supabase
      .from(this.tableName)
      .select(this.similarityProjection, { count: "exact" })
      .eq("is_public", true)
      .order("gdg_id", { ascending: true, nullsFirst: false })
      .limit(fetchLimit);

    if (error) throw new Error(`Database error: ${error.message}`);

    const sortedBySeed = [...(data || [])].sort((left, right) => {
      const leftKey = seededHash(left.gdg_id ?? "");
      const rightKey = seededHash(right.gdg_id ?? "");
      if (leftKey !== rightKey) return leftKey - rightKey;

      return (left.gdg_id ?? "").localeCompare(right.gdg_id ?? "");
    });

    return {
      list: sortedBySeed
        .slice(from, to)
        .map((row) => this.mapSimilarityToDomain(row as SimilarityMemberRow)),
      count: count || sortedBySeed.length,
    };
  }

  async findSimilarMembersBasedOnField(
    memberGdgId: string,
    fieldName: string,
    fieldValue: unknown,
    pageNumber: number,
    pageSize: number,
  ): Promise<{ list: GdgMember[]; count: number }> {
    const from = (pageNumber - 1) * pageSize;
    const to = from + pageSize - 1;

    // map fieldname from domain to database column names
    const mappedFieldName = {
      program: "program",
      department: "department",
      yearLevel: "year_level",
      technicalSkills: "technical_skills",
      learningInterests: "learning_interests",
      toolsAndTechnologies: "tools_and_technologies",
    }[fieldName];

    if (!mappedFieldName) {
      throw new Error(`Unsupported field name: ${fieldName}`);
    }

    console.log(`Finding similar members based on ${fieldName} with value`, fieldValue);

    let orQuery = "";

    if (Array.isArray(fieldValue)) {
      // Handle array fields (technicalSkills, learningInterests, toolsAndTechnologies)
      if (fieldValue.length === 0) {
        return { list: [], count: 0 };
      }

      // Create an ilike clause for EACH item in the array, properly escaped
      const clauses = fieldValue
        .filter(Boolean)
        .map((val) => {
          const pattern = `%${String(val).trim()}%`;
          return `${mappedFieldName}.ilike.${this.wrapOrFilterValue(this.escapeLikePattern(pattern))}`;
        });

      orQuery = clauses.join(",");
    } else {
      // Handle scalar fields (program, department, yearLevel)
      if (fieldName === "yearLevel") {
        // year_level is a number, so use .eq instead of .ilike
        orQuery = `${mappedFieldName}.eq.${this.wrapOrFilterValue(String(fieldValue  || 3))}`;
      } else {
        orQuery = `${mappedFieldName}.ilike.${this.wrapOrFilterValue(`%${String(fieldValue).trim()}%`)}`;
      }
    }

    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("is_public", true)
      .neq("gdg_id", memberGdgId)
      .or(orQuery)
      .range(from, to);

    if (error) {
      console.error(
        `Error finding similar members based on ${fieldName}:`,
        error,
      );
      throw new Error(`Database error: ${error.message}`);
    }

    console.log(`No error for ${fieldName}, returning`);

    return {
      list: (data || []).map((row) => this.mapToDomain(row)),
      count: data?.length || 0,
    };
  }

  async search(query: string, limit: number): Promise<GdgMember[]> {
    const searchTerm = `%${query}%`;

    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .or(
        `display_name.ilike.${searchTerm},email.ilike.${searchTerm},first_name.ilike.${searchTerm},last_name.ilike.${searchTerm}`,
      )
      .limit(limit);

    if (error) {
      handlePostgresError(error);
    }

    return data ? data.map((row) => this.mapToDomain(row)) : [];
  }

  async findByGdgId(id: string): Promise<GdgMember | null> {
    const { data: gdg_member, error } = await supabase
      .from("gdg_members")
      .select("*")
      .eq("gdg_id", id)
      .maybeSingle();
    if (error) throw new Error(`Database error: ${error.message}`);

    const member = gdg_member ? this.mapToDomain(gdg_member) : null;

    return member;
  }

  async findByEmail(email: string): Promise<GdgMember | null> {
    const { data, error } = await supabase
      .from("gdg_members")
      .select("*")
      .eq("email", email)
      .maybeSingle();
    if (error) throw new Error(`Database error: ${error.message}`);
    return data ? this.mapToDomain(data) : null;
  }

  async findAll(
    pageNumber: number,
    pageSize: number,
    filters: GdgMemberFilters = {},
  ): Promise<{ list: GdgMember[]; count: number }> {
    let query = supabase.from(this.tableName).select("*", { count: "exact" });

    if (filters.search) {
      const s = `%${filters.search}%`;
      query = query.or(
        `display_name.ilike.${s},email.ilike.${s},first_name.ilike.${s},last_name.ilike.${s}`,
      );
    }
    if (filters.program) query = query.eq("program", filters.program);
    if (filters.department) query = query.eq("department", filters.department);

    const from = (pageNumber - 1) * pageSize;
    const { data, count, error } = await query.range(from, from + pageSize - 1);

    if (error) throw new Error(`Database error: ${error.message}`);

    return {
      list: (data || []).map((row) => this.mapToDomain(row)),
      count: count || 0,
    };
  }

  async findPublicMembersExcludingGdgId(
    gdgId: string,
    limit?: number,
  ): Promise<GdgMember[]> {
    let query = supabase
      .from(this.tableName)
      .select(this.similarityProjection)
      .eq("is_public", true)
      .neq("gdg_id", gdgId)
      .order("display_name", { ascending: true, nullsFirst: false })
      .order("first_name", { ascending: true, nullsFirst: false })
      .order("gdg_id", { ascending: true, nullsFirst: false });

    if (typeof limit === "number") {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) throw new Error(`Database error: ${error.message}`);

    return (data || []).map((row) =>
      this.mapSimilarityToDomain(row as SimilarityMemberRow),
    );
  }

  async findPublicMembersWithSameProgramOrDepartmentExcludingGdgId(
    gdgId: string,
    filters: {
      program: string | null;
      department: string | null;
    },
    limit = 100,
  ): Promise<GdgMember[]> {
    const { program, department } = filters;
    const merged = new Map<string, GdgMember>();

    const [sameProgramResult, sameDepartmentResult] = await Promise.all([
      program
        ? supabase
            .from(this.tableName)
            .select(this.similarityProjection)
            .eq("is_public", true)
            .neq("gdg_id", gdgId)
            .eq("program", program)
            .order("display_name", { ascending: true, nullsFirst: false })
            .order("first_name", { ascending: true, nullsFirst: false })
            .order("gdg_id", { ascending: true, nullsFirst: false })
            .limit(limit)
        : Promise.resolve({ data: [] as SimilarityMemberRow[], error: null }),
      department
        ? supabase
            .from(this.tableName)
            .select(this.similarityProjection)
            .eq("is_public", true)
            .neq("gdg_id", gdgId)
            .eq("department", department)
            .order("display_name", { ascending: true, nullsFirst: false })
            .order("first_name", { ascending: true, nullsFirst: false })
            .order("gdg_id", { ascending: true, nullsFirst: false })
            .limit(limit)
        : Promise.resolve({ data: [] as SimilarityMemberRow[], error: null }),
    ]);

    if (sameProgramResult.error)
      throw new Error(`Database error: ${sameProgramResult.error.message}`);
    if (sameDepartmentResult.error)
      throw new Error(`Database error: ${sameDepartmentResult.error.message}`);

    for (const row of sameProgramResult.data || []) {
      if (!row.gdg_id) continue;
      merged.set(row.gdg_id, this.mapSimilarityToDomain(row));
    }

    for (const row of sameDepartmentResult.data || []) {
      if (!row.gdg_id) continue;
      merged.set(row.gdg_id, this.mapSimilarityToDomain(row));
    }

    return [...merged.values()];
  }

  async findPublicMembersWithSameYearLevelExcludingGdgId(
    gdgId: string,
    yearLevel: number | null,
    limit = 100,
  ): Promise<GdgMember[]> {
    if (yearLevel === null) return [];

    const { data, error } = await supabase
      .from(this.tableName)
      .select(this.similarityProjection)
      .eq("is_public", true)
      .neq("gdg_id", gdgId)
      .eq("year_level", yearLevel)
      .order("display_name", { ascending: true, nullsFirst: false })
      .order("first_name", { ascending: true, nullsFirst: false })
      .order("gdg_id", { ascending: true, nullsFirst: false })
      .limit(limit);

    if (error) throw new Error(`Database error: ${error.message}`);

    return (data || []).map((row) =>
      this.mapSimilarityToDomain(row as SimilarityMemberRow),
    );
  }

  async findPublicSimilarMembersExcludingGdgId(
    gdgId: string,
    filters: {
      program: string | null;
      department: string | null;
      yearLevel: number | null;
      technicalSkills: string[];
      learningInterests: string[];
      toolsAndTechnologies: string[];
    },
    limit = 120,
  ): Promise<GdgMember[]> {
    const clauses: string[] = [];

    const pushEqClause = (
      column: "program" | "department" | "year_level",
      value: string | number,
    ): void => {
      clauses.push(`${column}.eq.${this.wrapOrFilterValue(String(value))}`);
    };

    const pushCollectionClauses = (
      column:
        | "technical_skills"
        | "learning_interests"
        | "tools_and_technologies",
      values: string[],
    ): void => {
      const normalized = [
        ...new Set(values.map((value) => value.trim().toLowerCase())),
      ]
        .filter(Boolean)
        .slice(0, 8);

      for (const value of normalized) {
        const pattern = `%${value}%`;
        clauses.push(
          `${column}.ilike.${this.wrapOrFilterValue(this.escapeLikePattern(pattern))}`,
        );
      }
    };

    if (filters.program) pushEqClause("program", filters.program);
    if (filters.department) pushEqClause("department", filters.department);
    if (filters.yearLevel !== null)
      pushEqClause("year_level", filters.yearLevel);
    pushCollectionClauses("technical_skills", filters.technicalSkills);
    pushCollectionClauses("learning_interests", filters.learningInterests);
    pushCollectionClauses(
      "tools_and_technologies",
      filters.toolsAndTechnologies,
    );

    if (clauses.length === 0) return [];

    const { data, error } = await supabase
      .from(this.tableName)
      .select(this.similarityProjection)
      .eq("is_public", true)
      .neq("gdg_id", gdgId)
      .or(clauses.join(","))
      .order("display_name", { ascending: true, nullsFirst: false })
      .order("first_name", { ascending: true, nullsFirst: false })
      .order("gdg_id", { ascending: true, nullsFirst: false })
      .limit(limit);

    if (error) throw new Error(`Database error: ${error.message}`);

    return (data || []).map((row) =>
      this.mapSimilarityToDomain(row as SimilarityMemberRow),
    );
  }

  private wrapOrFilterValue(value: string): string {
    return `"${value.replace(/"/g, '\\"')}"`;
  }

  private escapeLikePattern(value: string): string {
    return value.replace(/[%,_]/g, (token) => `\\${token}`);
  }

  async saveNew(member: GdgMember): Promise<GdgMember> {
    const p = member.props;
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(this.mapToInsertDb(member))
      .select()
      .single();

    if (error) throw new Error(`Failed to save GdgMember: ${error.message}`);
    return this.mapToDomain(data);
  }

  async persistUpdates(member: GdgMember): Promise<GdgMember> {
    const p = member.props;
    const { data, error } = await supabase
      .from(this.tableName)
      .update(this.mapToUpdateDb(member))
      .eq("gdg_id", p.gdgId)
      .select()
      .single();

    if (error) throw new Error(`Failed to update GdgMember: ${error.message}`);

    return this.mapToDomain(data);
  }

  async deleteByGdgId(id: string): Promise<void> {
    const { error } = await supabase.from(this.tableName).delete().eq("id", id);
    if (error) throw new Error(`Failed to delete GdgMember: ${error.message}`);
  }

  async getHighestIdNumberForYear(yearPrefix: string): Promise<number> {
    // Make sure the prefix casing matches what you expect in the DB.
    // E.g., if the DB is lowercase 'gdgpup-26-', adjust this prefix accordingly.
    const prefix = `GDGPUP-${yearPrefix}-`;

    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      // Use .ilike() instead of .like() if you want to ignore uppercase/lowercase differences
      .ilike("id", `${prefix}%`)
      // This works flawlessly because your IDs are zero-padded!
      .order("id", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw new Error(`Failed to get highest ID: ${error.message}`);
    if (!data) return 0;

    // Using .substring() is safer and faster than .replace(),
    // avoiding any case-sensitivity bugs when removing the prefix.
    const numPart = data.gdg_id.substring(prefix.length);

    return parseInt(numPart, 10) || 0;
  }
}
