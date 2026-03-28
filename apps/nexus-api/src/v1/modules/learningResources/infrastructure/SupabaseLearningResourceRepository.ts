import { supabase } from "@/v1/lib/supabase";
import { ILearningResourceRepository, LearningResourceFilters } from "../domain/ILearningResourceRepository";
import { LearningResource } from "../domain/LearningResource";

export class SupabaseLearningResourceRepository implements ILearningResourceRepository {
  private readonly tableName = "learning_resource";

  private mapToDomain(row: any): LearningResource {
    return LearningResource.hydrate({
      id: row.id,
      title: row.title,
      description: row.description || "",
      url: row.url,
      type: row.type,
      tags: row.tags || [],
      teamId: row.team_id,
      eventId: row.event_id,
      thumbnailUrl: row.thumbnail_url,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
  }

  async findById(id: string): Promise<LearningResource | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(`Database error: ${error.message}`);
    return data ? this.mapToDomain(data) : null;
  }

  async findAll(
    pageNumber: number,
    pageSize: number,
    filters?: LearningResourceFilters
  ): Promise<{ list: LearningResource[]; count: number }> {
    const from = (pageNumber - 1) * pageSize;
    let query = supabase
      .from(this.tableName)
      .select("*", { count: "exact" });

    if (filters) {
      if (filters.search) {
        const searchTerm = `%${filters.search}%`;
        query = query.or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`);
      }
      if (filters.teamId) {
        query = query.eq("team_id", filters.teamId);
      }
      if (filters.eventId) {
        query = query.eq("event_id", filters.eventId);
      }
      if (filters.type) {
        query = query.eq("type", filters.type);
      }
    }

    const { data, count, error } = await query
      .order("updated_at", { ascending: false })
      .range(from, from + pageSize - 1);

    if (error) throw new Error(`Database error: ${error.message}`);
    return {
      list: (data || []).map(this.mapToDomain),
      count: count || 0,
    };
  }

  async saveNew(learningResource: LearningResource): Promise<LearningResource> {
    const p = learningResource.props;
    const { data, error } = await supabase
      .from(this.tableName)
      .insert({
        id: p.id,
        title: p.title,
        description: p.description,
        url: p.url,
        type: p.type,
        tags: p.tags,
        team_id: p.teamId,
        event_id: p.eventId,
        thumbnail_url: p.thumbnailUrl,
        created_at: p.createdAt.toISOString(),
        updated_at: p.updatedAt.toISOString(),
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create learning resource: ${error.message}`);
    return this.mapToDomain(data);
  }

  async persistUpdates(learningResource: LearningResource): Promise<LearningResource> {
    const p = learningResource.props;
    const { data, error } = await supabase
      .from(this.tableName)
      .update({
        title: p.title,
        description: p.description,
        url: p.url,
        type: p.type,
        tags: p.tags,
        team_id: p.teamId,
        event_id: p.eventId,
        thumbnail_url: p.thumbnailUrl,
        updated_at: p.updatedAt.toISOString(),
      })
      .eq("id", p.id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update learning resource: ${error.message}`);
    return this.mapToDomain(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from(this.tableName).delete().eq("id", id);
    if (error) throw new Error(`Failed to delete learning resource: ${error.message}`);
  }
}
