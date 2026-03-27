import { supabase } from "@/v1/lib/supabase";
import { IMemberShowcaseRepository, MemberShowcaseFilters } from "../domain/IMemberShowcaseRepository";
import { MemberShowcase } from "../domain/MemberShowcase";

export class SupabaseMemberShowcaseRepository implements IMemberShowcaseRepository {
  private readonly tableName = "member_showcase";

  private mapToDomain(row: any): MemberShowcase {
    return MemberShowcase.hydrate({
      id: row.id,
      thumbnailUrl: row.thumbnail_url || "",
      title: row.title || "",
      date: new Date(row.date || Date.now()),
      description: row.description || "",
      articleUrl: row.article_url || "",
      showcasedMembers: row.showcased_members || [],
      createdAt: new Date(row.created_at || Date.now()),
    });
  }

  async findById(id: string): Promise<MemberShowcase | null> {
    const { data, error } = await supabase.from(this.tableName).select("*").eq("id", id).maybeSingle();
    if (error) throw new Error(`Database error: ${error.message}`);
    return data ? this.mapToDomain(data) : null;
  }

  async findAll(pageNumber: number, pageSize: number, filters: MemberShowcaseFilters = {}): Promise<{ list: MemberShowcase[]; count: number }> {
    let query = supabase.from(this.tableName).select("*", { count: "exact" });

    if (filters.search) {
      const term = filters.search.trim();
      query = query.or(`title.ilike.%${term}%,description.ilike.%${term}%`);
    }

    const from = (pageNumber - 1) * pageSize;
    const { data, count, error } = await query.order("date", { ascending: false }).range(from, from + pageSize - 1);
    
    if (error) throw new Error(`Database error: ${error.message}`);

    return {
      list: (data || []).map(row => this.mapToDomain(row)), 
      count: count || 0,
    };
  }

  async saveNew(memberShowcase: MemberShowcase): Promise<MemberShowcase> {
    const props = memberShowcase.props;
    const { data, error } = await supabase.from(this.tableName).insert({
      id: props.id,
      thumbnail_url: props.thumbnailUrl,
      title: props.title,
      date: props.date.toISOString(),
      description: props.description,
      article_url: props.articleUrl,
      showcased_members: props.showcasedMembers,
      created_at: props.createdAt.toISOString(),
    }).select().single();

    if (error) throw new Error(`Failed to create Member Showcase: ${error.message}`);
    return this.mapToDomain(data);
  }

  async persistUpdates(memberShowcase: MemberShowcase): Promise<MemberShowcase> {
    const props = memberShowcase.props;
    const { data, error } = await supabase.from(this.tableName).update({
      thumbnail_url: props.thumbnailUrl,
      title: props.title,
      date: props.date.toISOString(),
      description: props.description,
      article_url: props.articleUrl,
      showcased_members: props.showcasedMembers,
    }).eq("id", props.id).select().single();

    if (error) throw new Error(`Failed to update Member Showcase: ${error.message}`);
    return this.mapToDomain(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from(this.tableName).delete().eq("id", id);
    if (error) throw new Error(`Failed to delete Member Showcase: ${error.message}`);
  }
}
