/**
 * @file profile.repository.ts
 * @description Data access layer for User Profiles.
 * Utilizes SupabaseWrapper for standard database operations.
 */

import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase.types.js";
import {
  RepositoryResult,
  RepositoryResultList,
} from "@/types/repository.types.js";
import { DatabaseError_DONT_USE } from "@/errors/HttpError";
import { tryCatch_deprecated } from "@/utils/tryCatch.util";
import { SupabaseUtils } from "@/utils/supabase.util";

/**
 * Database types
 */
type profileRow = Tables<"user_profile">;
type profileInsert = TablesInsert<"user_profile">;
type profileUpdate = TablesUpdate<"user_profile">;

/**
 * ProfileRepository
 * Manages database persistence for profiles earned by users.
 */
export class ProfileRepository {
  tableName = "user_profile";

  /**
   * getProfileByUserId
   * Retrieves all profiles for a specific user.
   */
  getProfileByUserId = async (
    userId: string,
  ): RepositoryResultList<profileRow> => {
    const { data, error } = await tryCatch_deprecated(
      async () =>
        await SupabaseUtils.listRowsByFilter(this.tableName, 1, 1000, {
          user_id: userId,
        }),
      "Calling database to list profiles of user",
    );

    if (error) throw new DatabaseError_DONT_USE(error.message);

    return data;
  };

  /**
   * listProfiles
   * Retrieves all profiles in the system.
   */
  listProfilesPaginated = async (
    pageNumber: number,
    pageSize: number,
  ): RepositoryResultList<profileRow> => {
    const { data, error } = await tryCatch_deprecated(
      async () =>
        await SupabaseUtils.listRows(this.tableName, pageNumber, pageSize),
      "Calling database to list profiles",
    );

    if (error) throw new DatabaseError_DONT_USE(error.message);

    return data;
  };

  /**
   * getOneProfile
   * Fetches a single profile by ID.
   */
  getOneProfile = async (id: string): RepositoryResultList<profileRow> => {
    const { data, error } = await tryCatch_deprecated(
      async () => await SupabaseUtils.getOneRow(this.tableName, id),
      "Calling database to get one profile",
    );

    if (error) throw new DatabaseError_DONT_USE(error.message);

    return data;
  }

  /**
   * createProfile
   * Creates a new profile record.
   */
  createProfile = async (dto: profileInsert): RepositoryResult<profileRow> => {
    const { data, error } = await tryCatch_deprecated(
      async () => await SupabaseUtils.createRow(this.tableName, dto),
      "Calling database to create profile",
    );

    if (error) throw new DatabaseError_DONT_USE(error.message);

    return data;
  };

  /**
   * updateProfile
   * Updates an existing profile record.
   */
  async updateProfile(
    id: string,
    dto: profileUpdate,
  ): RepositoryResult<profileRow> => {
    const { data, error } = await tryCatch_deprecated(
      async () => await SupabaseUtils.updateRow(this.tableName, id, dto),
      "Calling database to update profile",
    );

    if (error) throw new DatabaseError_DONT_USE(error.message);

    return data;
  }

  /**
   * deleteProfile
   * Deletes an profile record.
   */
  deleteProfile = async (id: string): RepositoryResult<profileRow> => {
    const { data, error } = await tryCatch_deprecated(
      async () => await SupabaseUtils.deleteRow(this.tableName, id),
      "Calling database to delete profile",
    );

    if (error) throw new DatabaseError_DONT_USE(error.message);

    return data;
  }
}

export const profileRepositoryInstance = new ProfileRepository();
