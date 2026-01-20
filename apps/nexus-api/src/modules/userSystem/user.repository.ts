import { DatabaseError } from "@/classes/ServerError.js";
import { supabase } from "@/lib/supabase.js"; 
import { contract, models } from "@packages/nexus-api-contracts";

type userRow = models.userSystem.user.row;

export class UserRepository {
  tableName = "user";

  constructor() {}

  getUserById = async (userId: string)  : Promise<userRow>  => {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw new DatabaseError(error.message);

    return data;
  };
}

export const userRepositoryInstance = new UserRepository();
