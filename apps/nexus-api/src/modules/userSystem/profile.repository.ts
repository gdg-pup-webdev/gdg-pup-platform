import { DatabaseError } from "@/classes/ServerError.js";
import { supabase } from "@/lib/supabase.js";
import { RepositoryResult } from "@/types/repository.types.js";
import { models } from "@packages/nexus-api-contracts";

type profileRow = models.userSystem.profile.row;

export class ProfileRepository {
  tableName = "user_profile";

  constructor() {}

  getProfileByUserId = async (userId: string): RepositoryResult<profileRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) throw new DatabaseError(error.message);

    return data;
  };
}

export const profileRepositoryInstance = new ProfileRepository();
