/**
 * @file settings.repository.ts
 * @description Data access layer for User Settings.
 * Utilizes SupabaseWrapper for standard database operations.
 */

import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase.types.js";
import { SupabaseWrapper } from "../common/supabase.wrapper.js";

type settingsRow = Tables<"user_settings">;
type settingsInsert = TablesInsert<"user_settings">;
type settingsUpdate = TablesUpdate<"user_settings">;

/**
 * SettingsRepository
 * Manages database persistence for user-specific settings.
 */
export class SettingsRepository {
  private readonly db = new SupabaseWrapper<
    settingsRow,
    settingsInsert,
    settingsUpdate
  >("user_settings");

  /**
   * listSettingsOfUser
   * Retrieves all settings for a specific user.
   */
  listSettingsOfUser = (userId: string) => this.db.listByUser(userId);

  /**
   * listSettings
   * Retrieves all settings records in the system.
   */
  listSettings = () => this.db.listAll();

  /**
   * getOneSettings
   * Fetches a single settings record by ID.
   */
  getOneSettings = (id: string) => this.db.getOne(id);

  /**
   * createSettings
   * Creates a new settings record.
   */
  createSettings = (dto: settingsInsert) => this.db.create(dto);

  /**
   * updateSettings
   * Updates an existing settings record.
   */
  updateSettings = (id: string, dto: settingsUpdate) =>
    this.db.update(id, dto);

  /**
   * deleteSettings
   * Deletes a settings record.
   */
  deleteSettings = (id: string) => this.db.delete(id);
}

export const settingsRepositoryInstance = new SettingsRepository();