import { DatabaseError } from "@/classes/ServerError.js";
import { supabase } from "@/lib/supabase.js";
import { RepositoryResultList } from "@/types/repository.types.js";
import { Tables } from "@/types/supabase.types.js";

type roleRow = Tables<"user_role">;

/**
 * Repository for managing user roles in the database.
 */
export class RoleRepository {
  private readonly junctionTable = "user_role_junction";

  /**
   * Gets the roles of a user.
   * @returns A list of roles and the total count.
   * @throws {DatabaseError} If the database operation fails.
   */
  getRolesOfUser = async (userId: string): RepositoryResultList<roleRow> => {
    const { data, error } = await supabase
      .from(this.junctionTable)
      .select("*, user_role(*)")
      .eq("user_id", userId);
    if (error) throw new DatabaseError(error.message);

    const { count, error: countError } = await supabase
      .from(this.junctionTable)
      .select("*, user_role(*)", { count: "exact", head: true })
      .eq("user_id", userId);

    if (countError) throw new DatabaseError(countError.message);

    return {
      list: data.map((item) => item.user_role as roleRow),
      count: count || 0,
    };
  };
}

export const roleRepositoryInstance = new RoleRepository();
