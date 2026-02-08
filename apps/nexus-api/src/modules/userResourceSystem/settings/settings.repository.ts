/**
 * @file settings.repository.ts
 * @description Data access layer for User Settingss.
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
type settingsRow = Tables<"user_settings">;
type settingsInsert = TablesInsert<"user_settings">;
type settingsUpdate = TablesUpdate<"user_settings">;

/**
 * SettingsRepository
 * Manages database persistence for settingss earned by users.
 */
export class SettingsRepository {
  tableName = "user_settings";

  /**
   * listSettingssOfUser
   * Retrieves all settingss for a specific user.
   */
  listSettingsOfUser = async (
    userId: string,
  ): RepositoryResultList<settingsRow> => {
    return await SupabaseUtils.listRowsByFilter(this.tableName, 1, 1000, {
      user_id: userId,
    });
  };

  /**
   * listSettingss
   * Retrieves all settingss in the system.
   */
  listSettings = async (): RepositoryResultList<settingsRow> => {
    return await SupabaseUtils.listRows(this.tableName, 1, 1000);
  };

  /**
   * getOneSettings
   * Fetches a single settings by ID.
   */
  getOneSettings = async (id: string): RepositoryResult<settingsRow> => {
    return await SupabaseUtils.getOneRow(this.tableName, id);
  };

  /**
   * createSettings
   * Creates a new settings record.
   */
  createSettings = async (
    dto: settingsInsert,
  ): RepositoryResult<settingsRow> => {
    return await SupabaseUtils.createRow(this.tableName, dto);
  };

  /**
   * updateSettings
   * Updates an existing settings record.
   */
  updateSettings = async (
    id: string,
    dto: settingsUpdate,
  ): RepositoryResult<settingsRow> => {
    return await SupabaseUtils.updateRow(this.tableName, id, dto);
  };

  /**
   * deleteSettings
   * Deletes an settings record.
   */
  deleteSettings = async (id: string): RepositoryResult<settingsRow> => {
    return await SupabaseUtils.deleteRow(this.tableName, id);
  };
}

export const settingsRepositoryInstance = new SettingsRepository();
