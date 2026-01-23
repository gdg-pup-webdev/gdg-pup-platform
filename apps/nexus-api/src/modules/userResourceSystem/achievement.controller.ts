import { RequestHandler } from "express";
import { contract } from "@packages/nexus-api-contracts";
import { ServiceError } from "@/classes/ServerError.js";
import { createExpressController } from "@packages/typed-rest";
import { tryCatch } from "@/utils/tryCatch.util.js";
import { AchievementService, achievementServiceInstance } from "./achievement.service.js";

export class AchievementController {
  constructor(
    private achievementService: AchievementService = achievementServiceInstance,
  ) {}

  listUserAchievements: RequestHandler = createExpressController(
    contract.api.user_resource_system.achievements.GET,
    async ({ input, output }) => {
      // pagination options
      const pageNumber = input.query.page.number;
      const pageSize = input.query.page.size;

      // getting filters
      const userId = input.query.userId;

      let list, count;
      if (userId) {
        const { data, error } = await tryCatch(
          async () => await this.achievementService.listAchievementsOfUser(userId),
          "getting user achievements",
        );

        if (error) throw new ServiceError(error.message);

        list = data.list;
        count = data.count;
      } else {
        const { data, error } = await tryCatch(
          async () => await this.achievementService.listAchievements(),
          "getting all achievements",
        );

        if (error) throw new ServiceError(error.message);

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

  getOneAchievement: RequestHandler = createExpressController(
    contract.api.user_resource_system.achievements.achievementId.GET,
    async ({ input, output }) => {
      const achievementId = input.params.achievementId;
      const { data, error } = await tryCatch(
        async () => await this.achievementService.getOneAchievement(achievementId),
        "fetching achievement",
      );
      if (error) throw new ServiceError(error.message);

      return output(200, {
        status: "success",
        message: "Achievement fetched successfully",
        data,
      });
    },
  );

  createAchievement: RequestHandler = createExpressController(
    contract.api.user_resource_system.achievements.POST,
    async ({ input, output, ctx }) => {
      const { req } = ctx;
      const userId = req.user!.id; // user id from token parser

      const dto = input.body.data;
      const { data, error } = await tryCatch(
        async () => await this.achievementService.createAchievement(dto, userId),
        "creating achievement",
      );
      if (error) throw new ServiceError(error.message);

      return output(201, {
        status: "success",
        message: "Achievement created successfully",
        data,
      });
    },
  );

  updateAchievement: RequestHandler = createExpressController(
    contract.api.user_resource_system.achievements.achievementId.PATCH,
    async ({ input, output }) => {
      const achievementId = input.params.achievementId as string;
      const dto = input.body.data;

      const { data, error } = await tryCatch(
        async () => await this.achievementService.updateAchievement(achievementId, dto),
        "updating achievement",
      );
      if (error) throw new ServiceError(error.message);

      return output(200, {
        status: "success",
        message: "Achievement updated successfully",
        data,
      });
    },
  );

  deleteAchievement: RequestHandler = createExpressController(
    contract.api.user_resource_system.achievements.achievementId.DELETE,
    async ({ input, output }) => {
      const achievementId = input.params.achievementId;
      const { data, error } = await tryCatch(
        async () => await this.achievementService.deleteAchievement(achievementId),
        "deleting achievement",
      );
      if (error) throw new ServiceError(error.message);

      return output(200, {
        status: "success",
        message: "Achievement deleted successfully",
      });
    },
  );
}

export const achievementControllerInstance = new AchievementController();
