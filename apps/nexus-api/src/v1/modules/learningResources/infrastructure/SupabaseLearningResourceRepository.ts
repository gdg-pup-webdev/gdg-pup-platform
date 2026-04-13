import { supabase } from "@/v1/lib/supabase";
import { ILearningResourceRepository, LearningResourceFilters } from "../domain/ILearningResourceRepository";
import { LearningResource } from "../domain/LearningResource";

export class SupabaseLearningResourceRepository implements ILearningResourceRepository {
  private readonly tableName = "learning_resource";
  private readonly eventSelect = "event(id, title, description, start_date, end_date, venue, thumbnail_url, images:event_images(imageUrl, position))";
  private readonly selectQuery = `*, team(id, name, description), ${this.eventSelect}`;

  private resolveEventImageUrl(event: any): string | null {
    const mainImage = typeof event?.thumbnail_url === "string" ? event.thumbnail_url.trim() : "";
    if (mainImage.length > 0) {
      return mainImage;
    }

    const images = Array.isArray(event?.images) ? [...event.images] : [];
    images.sort((a, b) => Number(a?.position || 0) - Number(b?.position || 0));

    const first = images.find((image) => typeof image?.imageUrl === "string" && image.imageUrl.trim().length > 0);
    return first?.imageUrl || null;
  }

  private mapToDomain(row: any): LearningResource {
    return LearningResource.hydrate({
      id: row.id,
      title: row.title,
      description: row.description || "",
      url: row.url,
      tags: row.tags || [],
      teamId: row.team_id,
      eventId: row.event_id,
      thumbnailUrl: row.thumbnail_url,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      team: row.team ? { 
        id: row.team.id, 
        name: row.team.name,
        description: row.team.description
      } : null,
      event: row.event ? { 
        id: row.event.id, 
        title: row.event.title,
        description: row.event.description,
        imageUrl: this.resolveEventImageUrl(row.event),
        startDate: row.event.start_date ? new Date(row.event.start_date) : null,
        endDate: row.event.end_date ? new Date(row.event.end_date) : null,
        venue: row.event.venue
      } : null,
    });
  }


  async findById(id: string): Promise<LearningResource | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select(this.selectQuery)
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
    
    // Determine the select string. If teamName filter is used, we must use !inner join to filter the main table rows.
    const selectQuery = filters?.teamName 
      ? `*, team!inner(id, name, description), ${this.eventSelect}`
      : this.selectQuery;

    let query = supabase
      .from(this.tableName)
      .select(selectQuery, { count: "exact" });

    if (filters) {
      if (filters.search) {
        const searchTerm = `%${filters.search}%`;
        query = query.or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`);
      }
      if (filters.teamId) {
        query = query.eq("team_id", filters.teamId);
      }
      if (filters.teamName) {
        query = query.ilike("team.name", `%${filters.teamName}%`);
      }
      if (filters.eventId) {
        query = query.eq("event_id", filters.eventId);
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

  async findByTag(tag: string, pageNumber: number, pageSize: number): Promise<{ list: LearningResource[]; count: number }> {
    const from = (pageNumber - 1) * pageSize;
    const { data, count, error } = await supabase
      .from(this.tableName)
      .select(this.selectQuery, { count: "exact" })
      .contains("tags", [tag])
      .order("updated_at", { ascending: false })
      .range(from, from + pageSize - 1);

    if (error) throw new Error(`Database error: ${error.message}`);
    return {
      list: (data || []).map(this.mapToDomain),
      count: count || 0,
    };
  }

  async search(query: string, limit: number): Promise<LearningResource[]> {
    const searchTerm = `%${query}%`;
    const { data, error } = await supabase
      .from(this.tableName)
      .select(this.selectQuery)
      .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
      .order("updated_at", { ascending: false })
      .limit(limit);

    if (error) throw new Error(`Database error: ${error.message}`);
    return (data || []).map(this.mapToDomain);
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
        tags: p.tags,
        team_id: p.teamId,
        event_id: p.eventId,
        thumbnail_url: p.thumbnailUrl,
        created_at: p.createdAt.toISOString(),
        updated_at: p.updatedAt.toISOString(),
      })
      .select(this.selectQuery)
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
        tags: p.tags,
        team_id: p.teamId,
        event_id: p.eventId,
        thumbnail_url: p.thumbnailUrl || undefined, 
        updated_at: p.updatedAt.toISOString(),
      })
      .eq("id", p.id)
      .select(this.selectQuery)
      .single();

    if (error) throw new Error(`Failed to update learning resource: ${error.message}`);
    return this.mapToDomain(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from(this.tableName).delete().eq("id", id);
    if (error) throw new Error(`Failed to delete learning resource: ${error.message}`);
  }
}
