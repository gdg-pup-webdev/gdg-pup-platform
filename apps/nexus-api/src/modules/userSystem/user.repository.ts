import { DatabaseError } from "@/classes/ServerError.js";
import { supabase } from "@/lib/supabase.js";
import { RepositoryResult } from "@/types/repository.types.js";
import { Tables } from "@/types/supabase.types.js";

type userRow = Tables<"user">;
type userAggregate = Tables<"user"> & {
  wallet: Tables<"wallet">[];
  user_profile: Tables<"user_profile">[];
  user_project: Tables<"user_project">[];
  user_achievement: Tables<"user_achievement">[];
  user_certificate: Tables<"user_certificate">[];
  user_settings: Tables<"user_settings">[];
};

export class UserRepository {
  tableName = "user";

  constructor() {}

  getUserById = async (userId: string): Promise<userRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw new DatabaseError(error.message);

    return data;
  };

  getUserAggregate = async (
    userId: string,
  ): RepositoryResult<userAggregate> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .select(
        "*, wallet(*), user_profile(*), user_project(*), user_achievement(*), user_certificate(*), user_settings(*)",
      )
      .eq("id", userId)
      .single();

    if (error) throw new DatabaseError(error.message);

    return data;
  };

  listUsers = async () => {
    const { data, error } = await supabase.from(this.tableName).select("*");
    if (error) throw new DatabaseError(error.message);

    return data;
  };
}

export const userRepositoryInstance = new UserRepository();