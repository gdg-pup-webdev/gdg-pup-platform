/**
 * @file achievement.controller.ts
 * @description Controller for managing user achievements. Handles HTTP request parsing, 
 * contract validation via typed-rest, and response generation for achievement-related operations.
 */

import { RequestHandler } from "express";
import { contract } from "@packages/nexus-api-contracts";
import { ServiceError_DEPRECATED } from "@/classes/ServerError.js";
import { createExpressController } from "@packages/typed-rest";
import { tryCatch } from "@/utils/tryCatch.util.js";
import {
  AchievementService,
  achievementServiceInstance,
} from "./achievement.service.js";

/**
 * AchievementController
 * Exposes API endpoints for listing, fetching, creating, updating, and deleting achievements.
 */
export class AchievementController {
  /**
   * @param achievementService - Service layer for achievement business logic.
   */
  constructor(
    private readonly achievementService: AchievementService = achievementServiceInstance,
  ) {}

  /**
   * listUserAchievements
   * GET /api/user-resource-system/achievements
   * Lists achievements with optional filtering by userId and pagination.
   */
  listUserAchievements: RequestHandler = createExpressController(
    contract.api.user_resource_system.achievements.GET,
    async ({ input, output }) => {
      // pagination options with safe defaults from query
      const pageNumber = input.query.pageNumber;
      const pageSize = input.query.pageSize;

      // getting filters
      const userId = input.query.userId;

      let list, count;
      if (userId) {
        const { data, error } = await tryCatch(
          async () => await this.achievementService.listAchievementsOfUser(userId),
          "getting user achievements",
        );

        if (error) throw new ServiceError_DEPRECATED(error.message);

        list = data.list;
        count = data.count;
      } else {
        const { data, error } = await tryCatch(
          async () => await this.achievementService.listAchievements(),
          "getting all achievements",
        );

        if (error) throw new ServiceError_DEPRECATED(error.message);

        list = data.list;
        count = data.count;
      }

      return output(200, {
        status: "success",
        message: "User achievements fetched successfully",
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
   * getOneAchievement
   * GET /api/user-resource-system/achievements/:achievementId
   * Retrieves a single achievement by its ID.
   */
  getOneAchievement: RequestHandler = createExpressController(
    contract.api.user_resource_system.achievements.achievementId.GET,
    async ({ input, output }) => {
      const achievementId = input.params.achievementId;
      const { data, error } = await tryCatch(
        async () => await this.achievementService.getOneAchievement(achievementId),
        "fetching achievement",
      );
      if (error) throw new ServiceError_DEPRECATED(error.message);

      return output(200, {
        status: "success",
        message: "Achievement fetched successfully",
        data,
      });
    },
  );

  /**
   * createAchievement
   * POST /api/user-resource-system/achievements
   * Creates a new achievement record for the authenticated user.
   */
  createAchievement: RequestHandler = createExpressController(
    contract.api.user_resource_system.achievements.POST,
    async ({ input, output }) => {
      const dto = input.body.data;
      const { data, error } = await tryCatch(
        async () => await this.achievementService.createAchievement(dto),
        "creating achievement",
      );
      if (error) throw new ServiceError_DEPRECATED(error.message);

      return output(201, {
        status: "success",
        message: "Achievement created successfully",
        data,
      });
    },
  );

  /**
   * updateAchievement
   * PATCH /api/user-resource-system/achievements/:achievementId
   * Updates an existing achievement record.
   */
  updateAchievement: RequestHandler = createExpressController(
    contract.api.user_resource_system.achievements.achievementId.PATCH,
    async ({ input, output }) => {
      const achievementId = input.params.achievementId;
      const dto = input.body.data;

      const { data, error } = await tryCatch(
        async () => await this.achievementService.updateAchievement(achievementId, dto),
        "updating achievement",
      );
      if (error) throw new ServiceError_DEPRECATED(error.message);

      return output(200, {
        status: "success",
        message: "Achievement updated successfully",
        data,
      });
    },
  );

  /**
   * deleteAchievement
   * DELETE /api/user-resource-system/achievements/:achievementId
   * Deletes an achievement record by ID.
   */
  deleteAchievement: RequestHandler = createExpressController(
    contract.api.user_resource_system.achievements.achievementId.DELETE,
    async ({ input, output }) => {
      const achievementId = input.params.achievementId;
      const { error } = await tryCatch(
        async () => await this.achievementService.deleteAchievement(achievementId),
        "deleting achievement",
      );
      if (error) throw new ServiceError_DEPRECATED(error.message);

      return output(200, {
        status: "success",
        message: "Achievement deleted successfully",
      });
    },
  );
}

/**
 * Exported singleton instance of AchievementController.
 */
export const achievementControllerInstance = new AchievementController();
