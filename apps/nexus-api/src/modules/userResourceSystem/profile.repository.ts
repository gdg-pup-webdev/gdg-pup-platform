/**
 * @file profile.repository.ts
 * @description Data access layer for User Profiles.
 * Utilizes SupabaseWrapper for standard database operations.
 */

import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase.types.js";
import { SupabaseWrapper } from "../common/supabase.wrapper.js";
import { RepositoryResult } from "@/types/repository.types.js";

type profileRow = Tables<"user_profile">;
type profileInsert = TablesInsert<"user_profile">;
type profileUpdate = TablesUpdate<"user_profile">;

/**
 * ProfileRepository
 * Manages database persistence for user profiles.
 */
export class ProfileRepository {
  private readonly db = new SupabaseWrapper<
    profileRow,
    profileInsert,
    profileUpdate
  >("user_profile");

  /**
   * getProfileByUserId
   * Fetches a profile associated with a specific user ID.
   */
  getProfileByUserId = async (userId: string): RepositoryResult<profileRow> => {
    return this.db.listByUser(userId).then(res => res.list[0] || null);
  };

  /**
   * listProfilesPaginated
   * Retrieves a paginated list of all user profiles.
   */
  listProfilesPaginated = async (
    _pageNumber: number,
    _pageSize: number,
  ) => {
    // Note: SupabaseWrapper listAll uses exact count but doesn't handle range yet.
    // For now we use listAll, but in production we'd add range to wrapper.
    return this.db.listAll();
  };

  /**
   * createProfile
   * Creates a new user profile record.
   */
  createProfile = (dto: profileInsert) => this.db.create(dto);

  /**
   * updateProfile
   * Updates an existing profile by ID.
   */
  updateProfile = (id: string, dto: profileUpdate) => this.db.update(id, dto);

  /**
   * deleteProfile
   * Removes a profile record.
   */
  deleteProfile = (id: string) => this.db.delete(id);
}

export const profileRepositoryInstance = new ProfileRepository();