 import { supabase } from "@/v1/lib/supabase";
import { ITeamMemberRepository, TeamMemberFilters } from "../domain/ITeamMemberRepository";
import { TeamMember } from "../domain/TeamMember";

export class SupabaseTeamMemberRepository implements ITeamMemberRepository {
  private readonly tableName = "team_member";

  private mapToDomain(row: any): TeamMember {
    return TeamMember.hydrate({
      id: row.id,
      teamId: row.team_id,
      userId: row.user_id,
      role: row.role,
      joinedAt: new Date(row.created_at || Date.now()),
    });
  }

  async findById(id: string): Promise<TeamMember | null> {
    const { data, error } = await supabase.from(this.tableName).select("*").eq("id", id).maybeSingle();
    if (error) throw new Error(`Database error: ${error.message}`);
    return data ? this.mapToDomain(data) : null;
  }

  async findAllWithFilters(pageNumber: number, pageSize: number, filters: TeamMemberFilters): Promise<{ list: TeamMember[]; count: number }> {
    let query = supabase.from(this.tableName).select("*", { count: "exact" });
    
    if (filters.teamId) query = query.eq("team_id", filters.teamId);
    if (filters.userId) query = query.eq("user_id", filters.userId);
    if (filters.role) query = query.eq("role", filters.role);

    const from = (pageNumber - 1) * pageSize;
    const { data, count, error } = await query.order("role", { ascending: true }).range(from, from + pageSize - 1);
    
    if (error) throw new Error(`Database error: ${error.message}`);
    return { list: (data || []).map(this.mapToDomain), count: count || 0 };
  }

  async saveNew(member: TeamMember): Promise<TeamMember> {
    const props = member.props;
    const { data, error } = await supabase.from(this.tableName).insert({
      id: props.id,
      team_id: props.teamId,
      user_id: props.userId,
      role: props.role,
      created_at: props.joinedAt.toISOString(),
    }).select().single();

    if (error) throw new Error(`Failed to add team member: ${error.message}`);
    return this.mapToDomain(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from(this.tableName).delete().eq("id", id);
    if (error) throw new Error(`Failed to remove team member: ${error.message}`);
  }
}