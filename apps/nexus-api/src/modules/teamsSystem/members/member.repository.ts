import { DatabaseError_DONT_USE } from "@/errors/HttpError";
import { supabase } from "@/lib/supabase.js";
import {
  RepositoryResult,
  RepositoryResultList,
} from "@/types/repository.types.js";
import { Tables, TablesInsert } from "@/types/supabase.types.js";

type memberRow = Tables<"team_member">;
type memberInsert = TablesInsert<"team_member">;

/**
 * Repository for managing team members in the database.
 */
export class MemberRepository {
  private readonly memberTableName = "team_member";

  /**
   * Lists all members of a team.
   * @returns A list of members and the total count.
   * @throws {DatabaseError} If the database operation fails.
   */
  listMembersOfTeam = async (
    teamId: string,
  ): RepositoryResultList<memberRow> => {
    const { data, error } = await supabase
      .from(this.memberTableName)
      .select("*")
      .eq("team_id", teamId)
      .order("role", { ascending: true });

    if (error) throw new DatabaseError_DONT_USE(error.message);

    const { count, error: countError } = await supabase
      .from(this.memberTableName)
      .select("*", { count: "exact", head: true })
      .eq("team_id", teamId);

    if (countError) throw new DatabaseError_DONT_USE(countError.message);

    return {
      list: data,
      count: count || 0,
    };
  };

  /**
   * Lists members with filtering and pagination.
   * @returns A list of members and the total count.
   * @throws {DatabaseError} If the database operation fails.
   */
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

    const { data, count, error } = await query
      .order("role", { ascending: true })
      .range((pageNumber - 1) * pageSize, pageNumber * pageSize - 1);

    if (error) throw new DatabaseError_DONT_USE(error.message);

    return {
      list: data || [],
      count: count || 0,
    };
  };

  /**
   * Creates a new team member.
   * @returns The created member.
   * @throws {DatabaseError} If the database operation fails.
   */
  createMember = async (dto: memberInsert): RepositoryResult<memberRow> => {
    const { data, error } = await supabase
      .from(this.memberTableName)
      .insert(dto)
      .select("*")
      .single();

    if (error) throw new DatabaseError_DONT_USE(error.message);

    return data;
  };

  /**
   * Deletes a team member.
   * @returns The deleted member.
   * @throws {DatabaseError} If the database operation fails.
   */
  deleteMember = async (memberId: string): RepositoryResult<memberRow> => {
    const { data, error } = await supabase
      .from(this.memberTableName)
      .delete()
      .eq("id", memberId)
      .select("*")
      .single();

    if (error) throw new DatabaseError_DONT_USE(error.message);
    return data;
  };
}

export const memberRepositoryInstance = new MemberRepository();
