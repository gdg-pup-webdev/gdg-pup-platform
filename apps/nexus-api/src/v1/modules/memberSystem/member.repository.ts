import { supabase } from "@/v1/lib/supabase";
import { handlePostgresError } from "@/v1/lib/supabase.utils";
import { Tables } from "@/v1/presentation/types/supabase.types";
import { RepositoryResult } from "@/v1/presentation/types/repository.types";

 

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
