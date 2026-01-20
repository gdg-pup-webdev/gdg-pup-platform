import { DatabaseError } from "@/classes/ServerError.js";
import { supabase } from "@/lib/supabase.js";
import {
  RepositoryResult,
  RespositoryResultList,
} from "@/types/repository.types.js";
import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase.types.js";

type tableRow = Tables<"team">;
type tableInsert = TablesInsert<"team">;
type tableUpdate = TablesUpdate<"team">;

type memberRow = Tables<"team_member">;
type memberInsert = TablesInsert<"team_member">;
type memberUpdate = TablesUpdate<"team_member">;

export class TeamRepository {
  tableName = "team";
  memberTableName = "team_member";

  constructor() {}

  createTeam = async (dto: tableInsert): RepositoryResult<tableRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(dto)
      .select("*")
      .single();

    if (error) throw new DatabaseError(error.message);

    return data;
  };

  listTeams = async (): RespositoryResultList<tableRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new DatabaseError(error.message);

    const { count, error: countError } = await supabase
      .from(this.tableName)
      .select("*", { count: "exact", head: true });

    if (countError) throw new DatabaseError(countError.message);

    return {
      list: data,
      count: count || 0,
    };
  };

  getOneTeam = async (teamId: string): RepositoryResult<tableRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("id", teamId)
      .single();

    if (error) throw new DatabaseError(error.message);
    return data;
  };

  updateTeam = async (
    teamId: string,
    dto: tableUpdate,
  ): RepositoryResult<tableRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .update(dto)
      .eq("id", teamId)
      .select("*")
      .single();

    if (error) throw new DatabaseError(error.message);
    return data;
  };

  deleteTeam = async (teamId: string): RepositoryResult<tableRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .delete()
      .eq("id", teamId)
      .select("*")
      .single();

    if (error) throw new DatabaseError(error.message);
    return data;
  };

  listMembers = async (teamId: string): RespositoryResultList<memberRow> => {
    const { data, error } = await supabase
      .from(this.memberTableName)
      .select("*")
      .eq("team_id", teamId)
      .order("created_at", { ascending: true });

    if (error) throw new DatabaseError(error.message);

    const { count, error: countError } = await supabase
      .from(this.memberTableName)
      .select("*", { count: "exact", head: true })
      .eq("team_id", teamId);

    if (countError) throw new DatabaseError(countError.message);

    return {
      list: data,
      count: count || 0,
    };
  };

  createMember = async (dto: memberInsert): RepositoryResult<memberRow> => {
    const { data, error } = await supabase
      .from(this.memberTableName)
      .insert(dto)
      .select("*")
      .single();

    if (error) throw new DatabaseError(error.message);

    return data;
  };

  deleteMember = async (memberId: string): RepositoryResult<memberRow> => {
    const { data, error } = await supabase
      .from(this.memberTableName)
      .delete()
      .eq("id", memberId)
      .select("*")
      .single();

    if (error) throw new DatabaseError(error.message);
    return data;
  };
}

export const teamRepositoryInstance = new TeamRepository();
