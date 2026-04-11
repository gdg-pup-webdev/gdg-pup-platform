import { supabase } from "@/v1/lib/supabase";
import { GdgMember, SparkmatesSectionId } from "../domain/GdgMember";
import {
  IGdgMemberRepository,
  GdgMemberFilters,
} from "../domain/IGdgMemberRepository";
import { Tables } from "@/v1/types/supabase.types";
import { handlePostgresError } from "@/v1/lib/supabase.utils";

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

  private mapToDomain(row: Tables<"gdg_members">): GdgMember {
    return GdgMember.hydrate({
      gdgId: row.gdg_id || "",
      email: row.email || "",
      membershipType: row.membership_type || null,
      avatarUrl: row.avatar_image_url || null,
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

  private mapToDb(member: GdgMember): Tables<"gdg_members"> {
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

      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      nickname: null,
      skills_summary: null,
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

  async saveNew(member: GdgMember): Promise<GdgMember> {
    const p = member.props;
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(this.mapToDb(member))
      .select()
      .single();

    if (error) throw new Error(`Failed to save GdgMember: ${error.message}`);
    return this.mapToDomain(data);
  }

  async persistUpdates(member: GdgMember): Promise<GdgMember> {
    const p = member.props;
    const { data, error } = await supabase
      .from(this.tableName)
      .update(this.mapToDb(member))
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
