import { supabase } from "@/lib/supabase.js";
import { Models } from "@packages/nexus-api-contracts";

export class ProfileRepository {
  constructor() {}

  getProfileByUserId = async (userId: string) => {
    const { data, error } = await supabase
      .from("user_profile")
      .select("*")
      .eq("user_id", userId)
      .single();
    if (error) {
      return { error };
    }
    return { data: data as Models.userSystem.profile.row };
  };
}

export const profileRepositoryInstance = new ProfileRepository();