import { supabase } from "@/v1/lib/supabase";
import { GdgMember } from "../domain/GdgMember";
import { IGdgMemberRepository, GdgMemberFilters } from "../domain/IGdgMemberRepository";
import { Tables } from "@/v1/types/supabase.types";

export class SupabaseGdgMemberRepository implements IGdgMemberRepository {
  private readonly tableName = "gdg_members";

  private mapToDomain(row: Tables<"gdg_members">): GdgMember {
    return GdgMember.hydrate({
      id: row.id,
      gdgId: row.gdg_id,
      email: row.email,
      program: row.program || "",
      department: row.department || "",
      displayName: row.display_name || "",
      firstName: row.first_name || "",
      lastName: row.last_name || "",
      suffix: row.suffix || null,
    });
  }

  async findById(id: string): Promise<GdgMember | null> {
    const { data, error } = await supabase.from(this.tableName).select("*").eq("id", id).maybeSingle();
    if (error) throw new Error(`Database error: ${error.message}`);
    return data ? this.mapToDomain(data) : null;
  }

  async findByGdgId(gdgId: string): Promise<GdgMember | null> {
    const { data, error } = await supabase.from(this.tableName).select("*").eq("gdg_id", gdgId).maybeSingle();
    if (error) throw new Error(`Database error: ${error.message}`);
    return data ? this.mapToDomain(data) : null;
  }

  async findAll(pageNumber: number, pageSize: number, filters: GdgMemberFilters = {}): Promise<{ list: GdgMember[]; count: number }> {
    let query = supabase.from(this.tableName).select("*", { count: "exact" });

    if (filters.search) {
      const s = `%${filters.search}%`;
      query = query.or(`display_name.ilike.${s},email.ilike.${s},first_name.ilike.${s},last_name.ilike.${s}`);
    }
    if (filters.program) query = query.eq("program", filters.program);
    if (filters.department) query = query.eq("department", filters.department);

    const from = (pageNumber - 1) * pageSize;
    const { data, count, error } = await query.range(from, from + pageSize - 1);
    
    if (error) throw new Error(`Database error: ${error.message}`);

    return {
      list: (data || []).map(row => this.mapToDomain(row)), 
      count: count || 0,
    };
  }

  async saveNew(member: GdgMember): Promise<GdgMember> {
    const p = member.props;
    const { data, error } = await supabase.from(this.tableName).insert({
      id: p.id,
      gdg_id: p.gdgId,
      email: p.email,
      program: p.program,
      department: p.department,
      display_name: p.displayName,
      first_name: p.firstName,
      last_name: p.lastName,
      suffix: p.suffix
    }).select().single();

    if (error) throw new Error(`Failed to save GdgMember: ${error.message}`);
    return this.mapToDomain(data);
  }

  async persistUpdates(member: GdgMember): Promise<GdgMember> {
    const p = member.props;
    const { data, error } = await supabase.from(this.tableName).update({
      gdg_id: p.gdgId,
      email: p.email,
      program: p.program,
      department: p.department,
      display_name: p.displayName,
      first_name: p.firstName,
      last_name: p.lastName,
      suffix: p.suffix
    }).eq("id", p.id).select().single();

    if (error) throw new Error(`Failed to update GdgMember: ${error.message}`);
    return this.mapToDomain(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from(this.tableName).delete().eq("id", id);
    if (error) throw new Error(`Failed to delete GdgMember: ${error.message}`);
  }

  async getHighestIdNumberForYear(yearPrefix: string): Promise<number> {
    const prefix = `GDGPUP-${yearPrefix}-`;
    const { data, error } = await supabase
      .from(this.tableName)
      .select("id")
      .like("id", `${prefix}%`)
      .order("id", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw new Error(`Failed to get highest ID: ${error.message}`);
    if (!data) return 0;

    const numPart = data.id.replace(prefix, "");
    return parseInt(numPart, 10) || 0;
  }
}
