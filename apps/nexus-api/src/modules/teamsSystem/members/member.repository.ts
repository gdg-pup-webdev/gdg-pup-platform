import { DatabaseError } from "@/classes/ServerError.js";
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

export class MemberRepository {
  tableName = "team";
  memberTableName = "team_member";

  constructor() {}

  listMembersOfTeam = async (
    teamId: string,
  ): RepositoryResultList<memberRow> => {
    const { data, error } = await supabase
      .from(this.memberTableName)
      .select("*")
      .eq("team_id", teamId)
      .order("role", { ascending: true });

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

  listMembersWithFilter = async (
    pageNumber: number,
    pageSize: number,
    {
      teamId,
      userId,
      role,
    }: { teamId?: string; userId?: string; role?: string },
  ): Promise<RepositoryResultList<memberRow>> => {
    // 1. Start the query chain and ask for the exact count immediately
    let query = supabase
      .from(this.memberTableName)
      .select("*", { count: "exact" });

    // 2. Conditionally apply filters only if the values exist
    if (teamId) {
      query = query.eq("team_id", teamId);
    }
    if (userId) {
      query = query.eq("user_id", userId);
    }
    if (role) {
      query = query.eq("role", role);
    }

    // 3. Apply pagination and ordering
    const { data, count, error } = await query
      .order("role", { ascending: true })
      .range((pageNumber - 1) * pageSize, pageNumber * pageSize - 1);

    if (error) throw new DatabaseError(error.message);

    return {
      list: data || [],
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

export const memberRepositoryInstance = new MemberRepository();
