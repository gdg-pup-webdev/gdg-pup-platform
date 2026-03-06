/**
 * @file user.repository.ts
 * @description Data access layer for User entities and their aggregated resources.
 * This file handles direct interactions with the Supabase database for the User System.
 */

<<<<<<< HEAD:apps/nexus-api/src/modules/userSystem/users/user.repository.ts
import { supabase } from "@/lib/supabase.js";
import { handlePostgresError } from "@/lib/supabase.utils";
import { RepositoryResult } from "@/presentation/types/repository.types.js";
import {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/presentation/types/supabase.types.js";
=======
import { supabase } from "@/v0/lib/supabase.js";
import { handlePostgresError } from "@/v0/lib/supabase.utils";
import { RepositoryResult } from "@/v0/types/repository.types.js";
import { Tables, TablesInsert, TablesUpdate } from "@/v0/types/supabase.types.js";
>>>>>>> dev:apps/nexus-api/src/v0/modules/userSystem/users/user.repository.ts

type userRow = Tables<"user">;
type userInsert = TablesInsert<"user">;
type userUpdate = TablesUpdate<"user">;

/**
 * userAggregate
 * Represents a user with all their associated resources joined from related tables.
 */
type userAggregate = userRow & {
  wallet: Tables<"wallet">[];
  user_profile: Tables<"user_profile">[];
  user_project: Tables<"user_project">[];
  user_achievement: Tables<"user_achievement">[];
  user_certificate: Tables<"user_certificate">[];
  user_settings: Tables<"user_settings">[];
};

/**
 * UserRepository
 * Manages database queries for the user system, including complex joins for resource aggregation.
 */
export class UserRepository {
  tableName = "user";

  /**
   * getUserById
   * Fetches a single user record by their unique identifier.
   */
  getUserById = async (userId: string): RepositoryResult<userRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("id", userId)
      .single();
    if (error) handlePostgresError(error);
    return data;
  };

  /**
   * getUserByEmail
   * Fetches a single user record by their email.
   */
  getUserByEmail = async (email: string): RepositoryResult<userRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("email", email)
      .maybeSingle();
    if (error) handlePostgresError(error);
    return data;
  };

  /**
   * listUsers
   * Retrieves all user records from the system.
   */
  listUsers = async () => {
    const { data, error } = await supabase.from("user").select("*");
    if (error) handlePostgresError(error);
    return data;
  };

  /**
   * getUserAggregate
   * Fetches a comprehensive view of a user, joining all their owned resources in one query.
   * @param userId - The ID of the user to aggregate.
   */
  getUserAggregate = async (
    userId: string,
  ): RepositoryResult<userAggregate> => {
    const { data, error } = await supabase
      .from("user")
      .select(
        "*, wallet(*), user_profile(*), user_project(*), user_achievement(*), user_certificate(*), user_settings(*)",
      )
      .eq("id", userId)
      .single();

    if (error) handlePostgresError(error);

    return data as userAggregate;
  };
}

/**
 * Exported singleton instance of UserRepository.
 */
/**
 * @deprecated
 */
export const userRepositoryInstance = new UserRepository();
