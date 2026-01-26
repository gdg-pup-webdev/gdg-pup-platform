/**
 * @file settings.service.ts
 * @description Service layer for managing user settings.
 */

import {
  SettingsRepository,
  settingsRepositoryInstance,
} from "./settings.repository.js";
import { tryCatch } from "@/utils/tryCatch.util.js";
import { RepositoryError } from "@/classes/ServerError.js";
import { models } from "@packages/nexus-api-contracts";

type settingsInsertDTO = models.userResourceSystem.settings.insertDTO;
type settingsUpdateDTO = models.userResourceSystem.settings.updateDTO;

export class SettingsService {
  constructor(
    private readonly settingsRepository: SettingsRepository = settingsRepositoryInstance,
  ) {}

  listSettingsOfUser = async (userId: string) => {
    const { data, error } = await tryCatch(
      async () => await this.settingsRepository.listSettingsOfUser(userId),
      "listing settings",
    );
    if (error) throw new RepositoryError(error.message);
    return data;
  };

  listSettings = async () => {
    const { data, error } = await tryCatch(
      async () => await this.settingsRepository.listSettings(),
      "listing settings",
    );
    if (error) throw new RepositoryError(error.message);
    return data;
  };

  getOneSettings = async (id: string) => {
    const { data, error } = await tryCatch(
      async () => await this.settingsRepository.getOneSettings(id),
      "getting settings",
    );
    if (error) throw new RepositoryError(error.message);
    return data;
  };

  createSettings = async (dto: settingsInsertDTO) => {
    const { data, error } = await tryCatch(
      async () =>
        await this.settingsRepository.createSettings(dto),
      "creating settings",
    );

    if (error) throw new RepositoryError(error.message);
    return data;
  };

  deleteSettings = async (id: string) => {
    const { data, error } = await tryCatch(
      async () => await this.settingsRepository.deleteSettings(id),
      "deleting settings",
    );

    if (error) throw new RepositoryError(error.message);
    return data;
  };

  updateSettings = async (id: string, dto: settingsUpdateDTO) => {
    const { data, error } = await tryCatch(
      async () => await this.settingsRepository.updateSettings(id, dto),
      "updating settings",
    );
    if (error) throw new RepositoryError(error.message);
    return data;
  };
}

export const settingsServiceInstance = new SettingsService();
