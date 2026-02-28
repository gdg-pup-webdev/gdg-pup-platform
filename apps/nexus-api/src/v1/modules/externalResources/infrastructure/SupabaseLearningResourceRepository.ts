 
import { supabase } from "@/v1/lib/supabase";
import { ILearningResourceRepository, LearningResourceFilters } from "../domain/ILearningResourceRepository";
import { LearningResource } from "../domain/LearningResource";

export class SupabaseLearningResourceRepository implements ILearningResourceRepository {
  // Assuming the table is renamed to match the domain, adjust if it remains "external_resource"
  private readonly tableName = "learning_resource"; 

  private mapToDomain(row: any, tagIds: string[] = []): LearningResource {
    return LearningResource.hydrate({
      id: row.id,
      uploaderId: row.uploader_id,
      title: row.title || "",
      description: row.description || "",
      url: row.url || "",
      tagIds: tagIds,
      createdAt: new Date(row.created_at || Date.now()),
    });
  }

  async findById(id: string): Promise<LearningResource | null> {
    const { data, error } = await supabase.from(this.tableName).select("*").eq("id", id).maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return null;

    const { data: tags } = await supabase.from("resource_tag_junction").select("resource_tag_id").eq("resource_id", id);
    const tagIds = (tags || []).map(t => t.resource_tag_id);

    return this.mapToDomain(data, tagIds);
  }

  async findAll(pageNumber: number, pageSize: number, filters: LearningResourceFilters = {}): Promise<{ list: LearningResource[]; count: number }> {
    let query = supabase.from(this.tableName).select("*", { count: "exact" });

    if (filters.search) {
      const term = filters.search.trim();
      query = query.or(`title.ilike.%${term}%,description.ilike.%${term}%`);
    }
    if (filters.createdFrom) query = query.gte("created_at", filters.createdFrom);
    if (filters.createdTo) query = query.lte("created_at", filters.createdTo);
    if (filters.uploaderId) query = query.eq("uploader_id", filters.uploaderId);

    if (filters.tagIds && filters.tagIds.length > 0) {
      const { data: tagged } = await supabase.from("resource_tag_junction").select("resource_id").in("resource_tag_id", filters.tagIds);
      const resourceIds = Array.from(new Set((tagged || []).map(t => t.resource_id)));
      if (resourceIds.length === 0) return { list: [], count: 0 };
      query = query.in("id", resourceIds);
    }

    const from = (pageNumber - 1) * pageSize;
    const { data, count, error } = await query.order("created_at", { ascending: false }).range(from, from + pageSize - 1);
    
    if (error) throw new Error(error.message);

    // Note: For a fully optimized query, you would join tags here rather than making N+1 queries. 
    // This maps the raw data for now.
    return {
      list: (data || []).map(row => this.mapToDomain(row, [])), 
      count: count || 0,
    };
  }

  async saveNew(resource: LearningResource): Promise<LearningResource> {
    const props = resource.props;
    const { data, error } = await supabase.from(this.tableName).insert({
      id: props.id,
      uploader_id: props.uploaderId,
      title: props.title,
      description: props.description,
      url: props.url,
      created_at: props.createdAt.toISOString(),
    }).select().single();

    if (error) throw new Error(error.message);

    // Handle tag insertion
    if (props.tagIds.length > 0) {
      const junctions = props.tagIds.map(tagId => ({ resource_id: props.id, resource_tag_id: tagId }));
      await supabase.from("resource_tag_junction").insert(junctions);
    }

    return this.mapToDomain(data, props.tagIds);
  }

  async persistUpdates(resource: LearningResource): Promise<LearningResource> {
    const props = resource.props;
    const { data, error } = await supabase.from(this.tableName).update({
      title: props.title,
      description: props.description,
      url: props.url,
    }).eq("id", props.id).select().single();

    if (error) throw new Error(error.message);

    // Sync tags: Wipe and replace
    await supabase.from("resource_tag_junction").delete().eq("resource_id", props.id);
    if (props.tagIds.length > 0) {
      const junctions = props.tagIds.map(tagId => ({ resource_id: props.id, resource_tag_id: tagId }));
      await supabase.from("resource_tag_junction").insert(junctions);
    }

    return this.mapToDomain(data, props.tagIds);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from(this.tableName).delete().eq("id", id);
    if (error) throw new Error(error.message);
  }
}