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

/**
 * Repository for managing teams in the database.
 */
export class TeamRepository {
  private readonly tableName = "team";

  /**
   * Creates a new team.
   * @returns The created team.
   * @throws {DatabaseError} If the database operation fails.
   */
  createTeam = async (dto: tableInsert): RepositoryResult<tableRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(dto)
      .select("*")
      .single();

    if (error) throw new DatabaseError_DONT_USE(error.message);

    return data;
  };

  /**
   * Lists all teams.
   * @returns A list of teams and the total count.
   * @throws {DatabaseError} If the database operation fails.
   */
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

  /**
   * Gets a single team by its ID.
   * @returns The fetched team.
   * @throws {DatabaseError} If the database operation fails.
   */
  getOneTeam = async (teamId: string): RepositoryResult<tableRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("id", teamId)
      .single();

    if (error) throw new DatabaseError_DONT_USE(error.message);
    return data;
  };

  /**
   * Updates a team.
   * @returns The updated team.
   * @throws {DatabaseError} If the database operation fails.
   */
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

  /**
   * Deletes a team.
   * @returns The deleted team.
   * @throws {DatabaseError} If the database operation fails.
   */
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
