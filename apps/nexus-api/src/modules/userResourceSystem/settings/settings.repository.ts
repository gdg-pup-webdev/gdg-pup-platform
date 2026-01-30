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
import { DatabaseError } from "@/classes/ServerError.js";
import { tryCatch } from "@/utils/tryCatch.util";
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
    const { data, error } = await tryCatch(
      async () =>
        await SupabaseUtils.listRowsWithFilter(this.tableName, 1, 1000, {
          user_id: userId,
        }),
      "Calling database to list settingss of user",
    );

    if (error) throw new DatabaseError(error.message);

    return data;
  };

  /**
   * listSettingss
   * Retrieves all settingss in the system.
   */
  listSettings = async (): RepositoryResultList<settingsRow> => {
    const { data, error } = await tryCatch(
      async () => await SupabaseUtils.listRows(this.tableName, 1, 1000),
      "Calling database to list settingss",
    );

    if (error) throw new DatabaseError(error.message);

    return data;
  };

  /**
   * getOneSettings
   * Fetches a single settings by ID.
   */
  getOneSettings = async (id: string): RepositoryResult<settingsRow> => {
    const { data, error } = await tryCatch(
      async () => await SupabaseUtils.getOneRow(this.tableName, id),
      "Calling database to get one settings",
    );

    if (error) throw new DatabaseError(error.message);

    return data;
  };

  /**
   * createSettings
   * Creates a new settings record.
   */
  createSettings = async (
    dto: settingsInsert,
  ): RepositoryResult<settingsRow> => {
    const { data, error } = await tryCatch(
      async () => await SupabaseUtils.createRow(this.tableName, dto),
      "Calling database to create settings",
    );

    if (error) throw new DatabaseError(error.message);

    return data;
  };

  /**
   * updateSettings
   * Updates an existing settings record.
   */
  updateSettings = async (
    id: string,
    dto: settingsUpdate,
  ): RepositoryResult<settingsRow> => {
    const { data, error } = await tryCatch(
      async () => await SupabaseUtils.updateRow(this.tableName, id, dto),
      "Calling database to update settings",
    );

    if (error) throw new DatabaseError(error.message);

    return data;
  };

  /**
   * deleteSettings
   * Deletes an settings record.
   */
  deleteSettings = async (id: string): RepositoryResult<settingsRow> => {
    const { data, error } = await tryCatch(
      async () => await SupabaseUtils.deleteRow(this.tableName, id),
      "Calling database to delete settings",
    );

    if (error) throw new DatabaseError(error.message);

    return data;
  };
}

export const settingsRepositoryInstance = new SettingsRepository();
