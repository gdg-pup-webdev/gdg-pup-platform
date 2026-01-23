import { DatabaseError } from "@/classes/ServerError.js";
import { supabase } from "@/lib/supabase.js";
import {
  RepositoryResult,
  RespositoryResultList,
} from "@/types/repository.types.js";
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

  listProfilesPaginated = async (
    pageNumber: number,
    pageSize: number,
  ): RespositoryResultList<profileRow> => {
    const from = (pageNumber - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data: listData, error: listError } = await supabase
      .from(this.tableName)
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (listError) throw new DatabaseError(listError.message);

    const { count, error } = await supabase
      .from(this.tableName)
      .select("*", { count: "exact", head: true })
      .order("created_at", { ascending: false });

    if (error) throw new DatabaseError(error.message);

    return {
      list: listData || [],
      count: count || 0,
    };
  };
}

export const profileRepositoryInstance = new ProfileRepository();
