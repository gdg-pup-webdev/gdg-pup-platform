import { supabase } from "@/lib/supabase.js";
import { Models } from "@packages/nexus-api-contracts";

export class RoleRepository {
  constructor() {}

  getRolesOfUser = async (userId: string) => {
    const { data, error } = await supabase
      .from("user_role_junction")
      .select("*, user_role(*)")
      .eq("user_id", userId);
    if (error) {
      return { error };
    }

    return {
      data: data.map((item) => item.user_role) as Models.roleSystem.role.row[],
    };
  };
}

export const roleRepositoryInstance = new RoleRepository();
