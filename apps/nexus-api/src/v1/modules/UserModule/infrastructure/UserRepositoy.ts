 
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
    // Note: Assuming your DB columns are snake_case. 
    // Type casting used here as a fallback in case your Tables<"user"> type 
    // doesn't explicitly list username or role_id yet.
    const props: UserProps = {
      id: row.id,
      email: row.email,
      username: (row as any).username || "",
      roleId: (row as any).role_id || (row as any).roleId || "",
      createdAt: new Date((row as any).created_at || (row as any).createdAt),
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
      .maybeSingle(); // maybeSingle returns null instead of an error if no record is found

    if (error) {
      handlePostgresError(error);
      throw new Error(`Database error while fetching user with ID ${id}`);
    }

    if (!data) return null;

    return this.mapToDomain(data);
  }

  /**
   * Retrieves a paginated list of users and the total count.
   * Assumes pageNumber is 1-indexed (e.g., page 1, 2, 3...).
   */
  async paginatedList(
    pageNumber: number,
    pageSize: number
  ): Promise<{ list: User[]; count: number }> {
    // Calculate the inclusive range for Supabase
    // e.g., Page 1, Size 10 => from: 0, to: 9
    const from = (pageNumber - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from(this.tableName)
      .select("*", { count: "exact" }) // 'exact' tells Supabase to return the total row count
      .range(from, to);

    if (error) {
      handlePostgresError(error);
      throw new Error("Database error while fetching paginated users.");
    }

    // Map the raw DB rows to our Domain Entities
    const userList = data ? data.map((row) => this.mapToDomain(row)) : [];

    return {
      list: userList,
      count: count || 0,
    };
  }
}