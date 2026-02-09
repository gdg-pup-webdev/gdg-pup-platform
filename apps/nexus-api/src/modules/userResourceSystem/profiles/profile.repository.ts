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

  constructor() {}

  /**
   * getProfileByUserId
   * Retrieves all profiles for a specific user.
   */
  getProfileByUserId = async (
    userId: string,
  ): RepositoryResultList<profileRow> => {
    return await SupabaseUtils.listRowsByFilter(this.tableName, 1, 1000, {
      user_id: userId,
    });
  };

  /**
   * listProfiles
   * Retrieves all profiles in the system.
   */
  listProfilesPaginated = async (
    pageNumber: number,
    pageSize: number,
  ): RepositoryResultList<profileRow> => {
    return await SupabaseUtils.listRows(this.tableName, pageNumber, pageSize);
  };

  /**
   * getOneProfile
   * Fetches a single profile by ID.
   */
  getOneProfile = async (id: string): RepositoryResultList<profileRow> => {
    return await SupabaseUtils.getOneRow(this.tableName, id);
  };

  /**
   * createProfile
   * Creates a new profile record.
   */
  createProfile = async (dto: profileInsert): RepositoryResult<profileRow> => {
    return await SupabaseUtils.createRow(this.tableName, dto);
  };

  /**
   * updateProfile
   * Updates an existing profile record.
   */
  async updateProfile(
    id: string,
    dto: profileUpdate,
  ): RepositoryResult<profileRow> {
    return await SupabaseUtils.updateRow(this.tableName, id, dto);
  }

  /**
   * deleteProfile
   * Deletes an profile record.
   */
  deleteProfile = async (id: string): RepositoryResult<profileRow> => {
    return await SupabaseUtils.deleteRow(this.tableName, id);
  };
}

export const profileRepositoryInstance = new ProfileRepository();
