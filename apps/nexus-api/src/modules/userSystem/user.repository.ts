/**
 * @file user.repository.ts
 * @description Data access layer for User entities and their aggregated resources.
 * This file handles direct interactions with the Supabase database for the User System.
 */

import { DatabaseError } from "@/classes/ServerError.js";
import { supabase } from "@/lib/supabase.js";
import { RepositoryResult } from "@/types/repository.types.js";
import { Tables } from "@/types/supabase.types.js";

type userRow = Tables<"user">;

/**
 * userAggregate
 * Represents a user with all their associated resources joined from related tables.
 */
type userAggregate = Tables<"user"> & {
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
  /** The primary table name for this repository */
  tableName = "user";

  /**
   * getUserById
   * Fetches a single user record by their unique identifier.
   * @param userId - The ID of the user to fetch.
   */
  getUserById = async (userId: string): Promise<userRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw new DatabaseError(error.message);

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
      .from(this.tableName)
      .select(
        "*, wallet(*), user_profile(*), user_project(*), user_achievement(*), user_certificate(*), user_settings(*)",
      )
      .eq("id", userId)
      .single();

    if (error) throw new DatabaseError(error.message);

    return data as userAggregate;
  };

  /**
   * listUsers
   * Retrieves all user records from the system.
   */
  listUsers = async () => {
    const { data, error } = await supabase.from(this.tableName).select("*");
    if (error) throw new DatabaseError(error.message);

    return data;
  };
}

/**
 * Exported singleton instance of UserRepository.
 */
export const userRepositoryInstance = new UserRepository();
