/**
 * @file settings.service.ts
 * @description Service layer for managing user settings.
 */

import {
  TablesInsert,
  TablesUpdate,
} from "@/v0/presentation/types/supabase.types.js";
import {
  SettingsRepository,
  settingsRepositoryInstance,
} from "./settings.repository.js";
import { models } from "@packages/nexus-api-contracts";

type settingsInsertDTO = TablesInsert<"user_settings">;
type settingsUpdateDTO = TablesUpdate<"user_settings">;

export class SettingsService {
  constructor(
    private readonly settingsRepository: SettingsRepository = settingsRepositoryInstance,
  ) {}

  listSettingsOfUser = async (userId: string) => {
    return await this.settingsRepository.listSettingsOfUser(userId);
  };

  listSettings = async () => {
    return await this.settingsRepository.listSettings();
  };

  getOneSettings = async (id: string) => {
    return await this.settingsRepository.getOneSettings(id);
  };

  createSettings = async (dto: settingsInsertDTO) => {
    return await this.settingsRepository.createSettings(dto);
  };

  deleteSettings = async (id: string) => {
    return await this.settingsRepository.deleteSettings(id);
  };

  updateSettings = async (id: string, dto: settingsUpdateDTO) => {
    return await this.settingsRepository.updateSettings(id, dto);
  };
}

export const settingsServiceInstance = new SettingsService();
