import { supabase } from "@/v0/lib/supabase.js";
import { handlePostgresError } from "@/v0/lib/supabase.utils";
import { RepositoryResult } from "@/v0/types/repository.types.js";
import { Tables } from "@/v0/types/supabase.types.js";

type memberRow = Tables<"gdg_members">;

export class MemberRepository {
  readonly tableName = "gdg_members";

  /**
   * getMemberByEmail
   * Fetches a single member record by their email.
   */
  getMemberByEmail = async (email: string): RepositoryResult<memberRow> => {
    // Escape wildcards for ILIKE to prevent pattern injection
    const escapedEmail = email.replace(/[%_]/g, "\\$&");

    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .ilike("email", escapedEmail)
      .maybeSingle();

    if (error) {
      handlePostgresError(error);
    }

    return data;
  };
}

export const memberRepositoryInstance = new MemberRepository();
