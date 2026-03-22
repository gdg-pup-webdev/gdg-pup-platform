import { serviceRoleClient } from "@/v1/lib/supabase";
import { handlePostgresError } from "@/v1/lib/supabase.utils";
import { Tables } from "@/v1/types/supabase.types";
import { RepositoryResult } from "@/v1/types/repository.types";

type memberRow = Tables<"gdg_members">;

export class MemberRepository {
  readonly tableName = "gdg_members";

  /**
   * getMemberByEmail
   * Fetches a single member record by their email.
   * Uses serviceRoleClient to bypass RLS and avoid session bleeding.
   */
  getMemberByEmail = async (email: string): RepositoryResult<memberRow | null> => {
    // We use .eq() for exact email match. Emails are unique and should be exact.
    // If case-insensitivity is required, .ilike() is fine but usually emails 
    // are stored in a standard way (lowercase).
    const { data, error } = await serviceRoleClient
      .from(this.tableName)
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (error) {
      return handlePostgresError(error);
    }

    return data;
  };
}

export const memberRepositoryInstance = new MemberRepository();
