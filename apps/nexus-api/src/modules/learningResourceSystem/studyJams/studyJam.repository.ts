import { DatabaseError } from "@/classes/ServerError.js";
import { supabase } from "@/lib/supabase.js";
import {
  RepositoryResult,
  RepositoryResultList,
} from "@/types/repository.types.js";
import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase.types.js";

type tableRow = Tables<"study_jam">;
type tableUpdate = TablesUpdate<"study_jam">;
type tableInsert = TablesInsert<"study_jam">;

/**
 * Filters for listing study jams.
 */
export type StudyJamListFilters = {
  search?: string;
  createdFrom?: string;
  createdTo?: string;
};

/**
 * Repository for managing study jams in the database.
 */
export class StudyJamRepository {
  private readonly tableName = "study_jam";

  /**
   * Creates a new study jam.
   * @returns The created study jam.
   * @throws {DatabaseError} If the database operation fails.
   */
  create = async (dto: tableInsert): RepositoryResult<tableRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(dto)
      .select("*")
      .single();

    if (error) throw new DatabaseError(error.message);

    return data;
  };

  /**
   * Deletes a study jam.
   * @returns The deleted study jam.
   * @throws {DatabaseError} If the database operation fails.
   */
  delete = async (resourceId: string): RepositoryResult<tableRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .delete()
      .eq("id", resourceId)
      .select("*")
      .single();

    if (error) throw new DatabaseError(error.message);

    return data;
  };

  /**
   * Updates a study jam.
   * @returns The updated study jam.
   * @throws {DatabaseError} If the database operation fails.
   */
  update = async (
    resourceId: string,
    dto: tableUpdate,
  ): RepositoryResult<tableRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .update(dto)
      .eq("id", resourceId)
      .select("*")
      .single();

    if (error) throw new DatabaseError(error.message);

    return data;
  };

  /**
   * Lists study jams with pagination and filtering.
   * @returns A list of study jams and the total count.
   * @throws {DatabaseError} If the database operation fails.
   */
  list = async (
    pageNumber: number,
    pageSize: number,
    filters: StudyJamListFilters,
  ): RepositoryResultList<tableRow> => {
    const from = (pageNumber - 1) * pageSize;
    const to = pageNumber * pageSize - 1;

    let query = supabase.from(this.tableName).select("*", { count: "exact" });

    if (filters.search) {
      const term = filters.search.trim();
      query = query.or(
        `title.ilike.%${term}%,summary.ilike.%${term}%,description.ilike.%${term}%`,
      );
    }

    if (filters.createdFrom) {
      query = query.gte("created_at", filters.createdFrom);
    }

    if (filters.createdTo) {
      query = query.lte("created_at", filters.createdTo);
    }

    const { data, count, error } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw new DatabaseError(error.message);

    return {
      list: data || [],
      count: count || 0,
    };
  };

  /**
   * Gets a single study jam by its ID.
   * @returns The fetched study jam.
   * @throws {DatabaseError} If the database operation fails.
   */
  getOne = async (resourceId: string): RepositoryResult<tableRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("id", resourceId)
      .single();

    if (error) throw new DatabaseError(error.message);

    return data;
  };
}

export const studyJamRepositoryInstance = new StudyJamRepository();
