/**
 * @file settings.service.ts
 * @description Service layer for managing user settings.
 */

import {
  SettingsRepository,
  settingsRepositoryInstance,
} from "./settings.repository.js";
import { models } from "@packages/nexus-api-contracts";

type settingsInsertDTO = models.userResourceSystem.settings.insertDTO;
type settingsUpdateDTO = models.userResourceSystem.settings.updateDTO;

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
