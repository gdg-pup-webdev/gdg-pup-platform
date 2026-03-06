 import { supabase } from "@/v1/lib/supabase";
import { ITeamRepository } from "../domain/ITeamRepository";
import { Team } from "../domain/Team";

export class SupabaseTeamRepository implements ITeamRepository {
  private readonly tableName = "team";

  private mapToDomain(row: any): Team {
    return Team.hydrate({
      id: row.id,
      name: row.name,
      description: row.description || "",
      createdAt: new Date(row.created_at || Date.now()),
    });
  }

  async findById(id: string): Promise<Team | null> {
    const { data, error } = await supabase.from(this.tableName).select("*").eq("id", id).maybeSingle();
    if (error) throw new Error(`Database error: ${error.message}`);
    return data ? this.mapToDomain(data) : null;
  }

  async findAll(pageNumber: number, pageSize: number): Promise<{ list: Team[]; count: number }> {
    const from = (pageNumber - 1) * pageSize;
    const { data, count, error } = await supabase.from(this.tableName)
      .select("*", { count: "exact" }).order("name", { ascending: true }).range(from, from + pageSize - 1);
    
    if (error) throw new Error(`Database error: ${error.message}`);
    return { list: (data || []).map(this.mapToDomain), count: count || 0 };
  }

  async saveNew(team: Team): Promise<Team> {
    const props = team.props;
    const { data, error } = await supabase.from(this.tableName).insert({
      id: props.id,
      name: props.name,
      description: props.description,
      created_at: props.createdAt.toISOString(),
    }).select().single();

    if (error) throw new Error(`Failed to create team: ${error.message}`);
    return this.mapToDomain(data);
  }

  async persistUpdates(team: Team): Promise<Team> {
    const props = team.props;
    const { data, error } = await supabase.from(this.tableName).update({
      name: props.name,
      description: props.description,
    }).eq("id", props.id).select().single();

    if (error) throw new Error(`Failed to update team: ${error.message}`);
    return this.mapToDomain(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from(this.tableName).delete().eq("id", id);
    if (error) throw new Error(`Failed to delete team: ${error.message}`);
  }
}