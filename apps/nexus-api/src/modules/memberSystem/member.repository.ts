import { supabase } from "@/lib/supabase.js";
import { handlePostgresError } from "@/lib/supabase.utils";
import { RepositoryResult } from "@/types/repository.types.js";
import { Tables } from "@/types/supabase.types.js";

type memberRow = Tables<"gdg_members">;

export class MemberRepository {
  readonly tableName = "gdg_members";

  /**
   * getMemberByEmail
   * Fetches a single member record by their email.
   */
  getMemberByEmail = async (email: string): RepositoryResult<memberRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (error) handlePostgresError(error);

    return data;
  };
}

export const memberRepositoryInstance = new MemberRepository();
