/**
 * @file settings.repository.ts
 * @description Data access layer for User Settings.
 */

import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase.types.js";
import { BaseRepository } from "../common/base.repository.js";

type settingsRow = Tables<"user_settings">;
type settingsInsert = TablesInsert<"user_settings">;
type settingsUpdate = TablesUpdate<"user_settings">;

export class SettingsRepository extends BaseRepository<
  settingsRow,
  settingsInsert,
  settingsUpdate
> {
  constructor() {
    super("user_settings");
  }

  listSettingsOfUser = this.listByUser;
  listSettings = this.listAll;
  getOneSettings = this.getOne;
  createSettings = this.create;
  updateSettings = this.update;
  deleteSettings = this.delete;
}

export const settingsRepositoryInstance = new SettingsRepository();
