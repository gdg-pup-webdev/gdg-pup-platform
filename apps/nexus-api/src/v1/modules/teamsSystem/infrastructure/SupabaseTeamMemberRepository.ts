import { supabase } from "@/v1/lib/supabase";
import { Tables } from "@/v1/types/supabase.types";
import {
  ITeamMemberRepository,
  TeamMemberFilters,
} from "../domain/ITeamMemberRepository";
import { TeamMember } from "../domain/TeamMember";

type TeamMemberRow = Tables<"team_member">;
type UserRow = Tables<"user">;
type TeamMemberSelectRow = TeamMemberRow & {
  user: Pick<UserRow, "display_name" | "avatar_url"> | null;
};

export class SupabaseTeamMemberRepository implements ITeamMemberRepository {
  private readonly tableName = "team_member";
  private readonly selectClause = `
    id,
    role,
    team_id,
    user_id,
    user:user_id(
      display_name,
      avatar_url
    )
  `;

  private mapToDomain(row: TeamMemberSelectRow): TeamMember {
    return TeamMember.hydrate({
      id: row.id,
      teamId: row.team_id,
      userId: row.user_id,
      role: row.role,
      joinedAt: new Date(),
      name: row.user?.display_name ?? null,
      image: row.user?.avatar_url ?? null,
    });
  }

  async findById(id: string): Promise<TeamMember | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select(this.selectClause)
      .eq("id", id)
      .maybeSingle();
    if (error) throw new Error(`Database error: ${error.message}`);
    return data ? this.mapToDomain(data as TeamMemberSelectRow) : null;
  }

  async findAllWithFilters(
    pageNumber: number,
    pageSize: number,
    filters: TeamMemberFilters,
  ): Promise<{ list: TeamMember[]; count: number }> {
    let query = supabase
      .from(this.tableName)
      .select(this.selectClause, { count: "exact" });

    if (filters.teamId) query = query.eq("team_id", filters.teamId);
    if (filters.userId) query = query.eq("user_id", filters.userId);
    if (filters.role) query = query.eq("role", filters.role);

    const from = (pageNumber - 1) * pageSize;
    const { data, count, error } = await query
      .order("role", { ascending: true })
      .range(from, from + pageSize - 1);

    if (error) throw new Error(`Database error: ${error.message}`);
    return {
      list: ((data as TeamMemberSelectRow[] | null) || []).map((row) =>
        this.mapToDomain(row),
      ),
      count: count || 0,
    };
  }

  async saveNew(member: TeamMember): Promise<TeamMember> {
    const props = member.props;
    const { data, error } = await supabase
      .from(this.tableName)
      .insert({
        id: props.id,
        team_id: props.teamId,
        user_id: props.userId,
        role: props.role,
      })
      .select(this.selectClause)
      .single();

    if (error) throw new Error(`Failed to add team member: ${error.message}`);
    return this.mapToDomain(data as TeamMemberSelectRow);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from(this.tableName).delete().eq("id", id);
    if (error)
      throw new Error(`Failed to remove team member: ${error.message}`);
  }
}
