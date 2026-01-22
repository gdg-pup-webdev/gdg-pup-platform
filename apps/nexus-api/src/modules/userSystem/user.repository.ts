import { DatabaseError } from "@/classes/ServerError.js";
import { supabase } from "@/lib/supabase.js";
import { RepositoryResult } from "@/types/repository.types";
import { Tables } from "@/types/supabase.types";

type userRow = Tables<"user">;
type userAggregate = Tables<"user"> & {
  wallet: Tables<"wallet">[];
  user_profile: Tables<"user_profile">[];
  user_project: Tables<"user_project">[];
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
      .select("*, wallet(*), user_profile(*), user_project(*)")
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
