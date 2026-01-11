import { supabase } from "@/lib/supabase.js";
import { Models } from "@packages/nexus-api-contracts";

export class UserRepository {
  constructor() {}

  getUserById = async (userId: string) => {
    const { data, error } = await supabase
      .from("user")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      return { error };
    }
    return { data: data as Models.userSystem.user.row };
  };
}

export const userRepositoryInstance = new UserRepository();
