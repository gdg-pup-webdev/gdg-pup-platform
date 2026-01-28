/**
 * @file settings.controller.ts
 * @description Controller for managing user settings (e.g., UI theme).
 */

import { RequestHandler } from "express";
import { contract } from "@packages/nexus-api-contracts";
import { ServiceError } from "@/classes/ServerError.js";
import { createExpressController } from "@packages/typed-rest";
import { tryCatch } from "@/utils/tryCatch.util.js";
import {
  SettingsService,
  settingsServiceInstance,
} from "./settings.service.js";

export class SettingsController {
  constructor(
    private readonly settingsService: SettingsService = settingsServiceInstance,
  ) {}

  /**
   * listUserSettings
   * GET /api/user-resource-system/settings
   */
  listUserSettings: RequestHandler = createExpressController(
    contract.api.user_resource_system.settings.GET,
    async ({ input, output }) => {
      // pagination options with safe defaults from query
      const pageNumber = input.query.pageNumber;
      const pageSize = input.query.pageSize;
      const userId = input.query.userId;

      let list, count;
      if (userId) {
        const { data, error } = await tryCatch(
          async () => await this.settingsService.listSettingsOfUser(userId),
          "getting user settings",
        );
        if (error) throw new ServiceError(error.message);
        list = data.list;
        count = data.count;
      } else {
        const { data, error } = await tryCatch(
          async () => await this.settingsService.listSettings(),
          "getting all settings",
        );
        if (error) throw new ServiceError(error.message);
        list = data.list;
        count = data.count;
      }

      return output(200, {
        status: "success",
        message: "User settings fetched successfully",
        data: list,
        meta: {
          totalRecords: count,
          totalPages: Math.ceil(count / pageSize),
          currentPage: pageNumber,
          pageSize,
        },
      });
    },
  );

  /**
   * getOneSettings
   * GET /api/user-resource-system/settings/:settingsId
   */
  getOneSettings: RequestHandler = createExpressController(
    contract.api.user_resource_system.settings.settingsId.GET,
    async ({ input, output }) => {
      const settingsId = input.params.settingsId;
      const { data, error } = await tryCatch(
        async () => await this.settingsService.getOneSettings(settingsId),
        "fetching settings",
      );
      if (error) throw new ServiceError(error.message);

      return output(200, {
        status: "success",
        message: "Settings fetched successfully",
        data,
      });
    },
  );

  /**
   * createSettings
   * POST /api/user-resource-system/settings
   */
  createSettings: RequestHandler = createExpressController(
    contract.api.user_resource_system.settings.POST,
    async ({ input, output }) => {
      const dto = input.body.data;
      const { data, error } = await tryCatch(
        async () => await this.settingsService.createSettings(dto),
        "creating settings",
      );
      if (error) throw new ServiceError(error.message);

      return output(201, {
        status: "success",
        message: "Settings created successfully",
        data,
      });
    },
  );

  /**
   * updateSettings
   * PATCH /api/user-resource-system/settings/:settingsId
   */
  updateSettings: RequestHandler = createExpressController(
    contract.api.user_resource_system.settings.settingsId.PATCH,
    async ({ input, output }) => {
      const settingsId = input.params.settingsId;
      const dto = input.body.data;

      const { data, error } = await tryCatch(
        async () => await this.settingsService.updateSettings(settingsId, dto),
        "updating settings",
      );
      if (error) throw new ServiceError(error.message);

      return output(200, {
        status: "success",
        message: "Settings updated successfully",
        data,
      });
    },
  );

  /**
   * deleteSettings
   * DELETE /api/user-resource-system/settings/:settingsId
   */
  deleteSettings: RequestHandler = createExpressController(
    contract.api.user_resource_system.settings.settingsId.DELETE,
    async ({ input, output }) => {
      const settingsId = input.params.settingsId;
      const { error } = await tryCatch(
        async () => await this.settingsService.deleteSettings(settingsId),
        "deleting settings",
      );
      if (error) throw new ServiceError(error.message);

      return output(200, {
        status: "success",
        message: "Settings deleted successfully",
      });
    },
  );
}

export const settingsControllerInstance = new SettingsController();
