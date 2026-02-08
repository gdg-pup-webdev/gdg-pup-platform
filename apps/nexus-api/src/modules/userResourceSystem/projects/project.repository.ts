import { DatabaseError_DONT_USE } from "@/errors/HttpError";
import { supabase } from "@/lib/supabase.js";
import {
  RepositoryResult,
  RepositoryResultList,
} from "@/types/repository.types.js";
import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase.types.js";

type projectRow = Tables<"user_project">;
type projectInsert = TablesInsert<"user_project">;
type projectUpdate = TablesUpdate<"user_project">;

/**
 * Repository for managing user projects in the database.
 */
export class ProjectRepository {
  private readonly tableName = "user_project";

  /**
   * Lists all projects of a user.
   * @returns A list of projects and the total count.
   * @throws {DatabaseError} If the database operation fails.
   */
  listProjectsOfUser = async (
    userId: string,
  ): RepositoryResultList<projectRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("user_id", userId);
    if (error) throw new DatabaseError_DONT_USE(error.message);

    const { count, error: countError } = await supabase
      .from(this.tableName)
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);
    if (countError) throw new DatabaseError_DONT_USE(countError.message);

    return {
      list: data,
      count: count || 0,
    };
  };

  /**
   * Lists all projects.
   * @returns A list of projects and the total count.
   * @throws {DatabaseError} If the database operation fails.
   */
  listProjects = async (): RepositoryResultList<projectRow> => {
    const { data, error } = await supabase.from(this.tableName).select("*");
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
   * Gets a single project by its ID.
   * @returns The fetched project.
   * @throws {DatabaseError} If the database operation fails.
   */
  getOneProject = async (id: string): RepositoryResult<projectRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new DatabaseError_DONT_USE(error.message);

    return data;
  };

  /**
   * Creates a new project.
   * @returns The created project.
   * @throws {DatabaseError} If the database operation fails.
   */
  createProject = async (dto: projectInsert): RepositoryResult<projectRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(dto)
      .select("*")
      .single();
    if (error) throw new DatabaseError_DONT_USE(error.message);
    return data;
  };

  /**
   * Deletes a project.
   * @returns The deleted project.
   * @throws {DatabaseError} If the database operation fails.
   */
  deleteProject = async (id: string): RepositoryResult<projectRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .delete()
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw new DatabaseError_DONT_USE(error.message);
    return data;
  };

  /**
   * Updates a project.
   * @returns The updated project.
   * @throws {DatabaseError} If the database operation fails.
   */
  updateProject = async (
    id: string,
    dto: projectUpdate,
  ): RepositoryResult<projectRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .update(dto)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw new DatabaseError_DONT_USE(error.message);
    return data;
  };
}

export const projectRepositoryInstance = new ProjectRepository();
