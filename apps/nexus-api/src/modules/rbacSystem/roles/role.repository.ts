import { DatabaseError } from "@/classes/ServerError.js";
import { supabase } from "@/lib/supabase.js";
import { RespositoryResultList } from "@/types/repository.types.js";
import { Tables } from "@/types/supabase.types.js";
import { models } from "@packages/nexus-api-contracts";

type roleRow = Tables<"user_role">;

export class RoleRepository {
  junctionTable = "user_role_junction";

  constructor() {}

  getRolesOfUser = async (userId: string): RespositoryResultList<roleRow> => {
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
