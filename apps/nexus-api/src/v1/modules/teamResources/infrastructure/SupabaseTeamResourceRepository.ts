import { supabase } from "@/v1/lib/supabase";
import { ITeamResourceRepository, TeamResourceFilters } from "../domain/ITeamResourceRepository";
import { TeamResource } from "../domain/TeamResource";

export class SupabaseTeamResourceRepository implements ITeamResourceRepository {
  private readonly tableName = "team_resource";

  private mapToDomain(row: any): TeamResource {
    return TeamResource.hydrate({
      id: row.id,
      title: row.title,
      description: row.description || "",
      resourceLink: row.resource_link,
      resourceType: row.resource_type,
      thumbnailStorageReference: row.thumbnail_storage_reference,
      thumbnailPublicUrl: row.thumbnail_public_url,
      teamName: row.team_name,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
  }

  async findById(id: string): Promise<TeamResource | null> {
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
    filters?: TeamResourceFilters
  ): Promise<{ list: TeamResource[]; count: number }> {
    const from = (pageNumber - 1) * pageSize;
    let query = supabase
      .from(this.tableName)
      .select("*", { count: "exact" });

    if (filters) {
      if (filters.search) {
        const searchTerm = `%${filters.search}%`;
        query = query.or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`);
      }
      if (filters.teamName) {
        query = query.eq("team_name", filters.teamName);
      }
      if (filters.resourceType) {
        query = query.eq("resource_type", filters.resourceType);
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

  async saveNew(teamResource: TeamResource): Promise<TeamResource> {
    const p = teamResource.props;
    const { data, error } = await supabase
      .from(this.tableName)
      .insert({
        id: p.id,
        title: p.title,
        description: p.description,
        resource_link: p.resourceLink,
        resource_type: p.resourceType,
        thumbnail_storage_reference: p.thumbnailStorageReference,
        thumbnail_public_url: p.thumbnailPublicUrl,
        team_name: p.teamName,
        created_at: p.createdAt.toISOString(),
        updated_at: p.updatedAt.toISOString(),
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create team resource: ${error.message}`);
    return this.mapToDomain(data);
  }

  async persistUpdates(teamResource: TeamResource): Promise<TeamResource> {
    const p = teamResource.props;
    const { data, error } = await supabase
      .from(this.tableName)
      .update({
        title: p.title,
        description: p.description,
        resource_link: p.resourceLink,
        resource_type: p.resourceType,
        thumbnail_storage_reference: p.thumbnailStorageReference,
        thumbnail_public_url: p.thumbnailPublicUrl,
        team_name: p.teamName,
        updated_at: p.updatedAt.toISOString(),
      })
      .eq("id", p.id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update team resource: ${error.message}`);
    return this.mapToDomain(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from(this.tableName).delete().eq("id", id);
    if (error) throw new Error(`Failed to delete team resource: ${error.message}`);
  }
}
