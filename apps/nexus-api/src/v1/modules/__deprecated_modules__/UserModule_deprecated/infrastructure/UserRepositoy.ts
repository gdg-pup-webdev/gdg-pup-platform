 
import { Tables } from "@/v1/types/supabase.types";
import { IUserRepository } from "../domain/IUserRepository";
import { User, UserProps } from "../domain/User"; 
import { supabase } from "@/v1/lib/supabase";
import { handlePostgresError } from "@/v1/lib/supabase.utils";

type UserRow = Tables<"user">;

export class SupabaseUserRepository implements IUserRepository {
  private readonly tableName = "user";

  /**
   * Helper method to map the raw Supabase database row to our Domain Entity.
   * Handles snake_case (DB) to camelCase (Domain) conversions.
   */
  private mapToDomain(row: UserRow): User {
    const props: UserProps = {
      id: row.id,
      email: row.email,
      username: (row as any).username || (row as any).display_name || "",
      firstName: row.first_name || null,
      lastName: row.last_name || null,
      displayName: row.display_name || "",
      avatarUrl: row.avatar_url || null,
      gdgId: row.gdg_id || null,
      roleId: (row as any).role_id || (row as any).roleId || "",
      createdAt: new Date(row.created_at),
    };

    return User.hydrate(props);
  }

  /**
   * Retrieves a single user by their ID.
   */
  async findById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      handlePostgresError(error);
      throw new Error(`Database error while fetching user with ID ${id}`);
    }

    if (!data) return null;

    return this.mapToDomain(data);
  }

  /**
   * Retrieves a paginated list of users and the total count.
   */
  async paginatedList(
    pageNumber: number,
    pageSize: number
  ): Promise<{ list: User[]; count: number }> {
    const from = (pageNumber - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from(this.tableName)
      .select("*", { count: "exact" })
      .range(from, to);

    if (error) {
      handlePostgresError(error);
      throw new Error("Database error while fetching paginated users.");
    }

    const userList = data ? data.map((row) => this.mapToDomain(row)) : [];

    return {
      list: userList,
      count: count || 0,
    };
  }

  /**
   * Searches for users matching the query text in name, email, etc.
   */
  async search(query: string, limit: number): Promise<User[]> {
    const searchTerm = `%${query}%`;
    
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .or(`display_name.ilike.${searchTerm},email.ilike.${searchTerm},first_name.ilike.${searchTerm},last_name.ilike.${searchTerm}`)
      .limit(limit);

    if (error) {
      handlePostgresError(error);
      throw new Error("Database error while searching users.");
    }

    return data ? data.map((row) => this.mapToDomain(row)) : [];
  }
}
