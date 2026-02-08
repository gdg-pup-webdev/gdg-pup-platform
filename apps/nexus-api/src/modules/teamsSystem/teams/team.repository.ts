import { DatabaseError_DONT_USE } from "@/errors/HttpError";
import { supabase } from "@/lib/supabase.js";
import {
  RepositoryResult,
  RepositoryResultList,
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

    if (error) throw new DatabaseError_DONT_USE(error.message);

    return data;
  };

  listTeams = async (): RepositoryResultList<tableRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .order("name", { ascending: false });

    if (error) throw new DatabaseError_DONT_USE(error.message);

    const { count, error: countError } = await supabase
      .from(this.tableName)
      .select("*", { count: "exact", head: true });

    if (countError) throw new DatabaseError_DONT_USE(countError.message);

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

    if (error) throw new DatabaseError_DONT_USE(error.message);
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

    if (error) throw new DatabaseError_DONT_USE(error.message);
    return data;
  };

  deleteTeam = async (teamId: string): RepositoryResult<tableRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .delete()
      .eq("id", teamId)
      .select("*")
      .single();

    if (error) throw new DatabaseError_DONT_USE(error.message);
    return data;
  };
}

export const teamRepositoryInstance = new TeamRepository();
