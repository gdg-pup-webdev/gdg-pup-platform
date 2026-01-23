import { RequestHandler } from "express";
import { UserService, userServiceInstance } from "./user.service.js";
import { contract } from "@packages/nexus-api-contracts";
import { ServiceError } from "@/classes/ServerError.js";
import { createExpressController } from "@packages/typed-rest";
import { tryCatch } from "@/utils/tryCatch.util.js";

export class UserSystemController {
  constructor(private userService: UserService = userServiceInstance) {}

  listUsers: RequestHandler = async (_req, res) => {
    const { data, error } = await tryCatch(
      async () => await this.userService.listUsers(),
      "listing usersssss",
    );

    if (error) throw new ServiceError(error.message);

    return res.status(200).json({
      status: "success",
      message: "Users fetched successfully",
      data,
    });
  };

  getUserById: RequestHandler = createExpressController(
    contract.api.user_system.users.userId.GET,
    async ({ input, output }) => {
      const userId = input.params.userId;
      const { data, error } = await tryCatch(
        async () => await this.userService.getUserById(userId),
        "getting useradfasd",
      );

      if (error) throw new ServiceError(error.message);

      return output(200, {
        status: "success",
        message: "User fetched successfully",
        data,
      });
    },
  );

  getUserAggregate: RequestHandler = createExpressController(
    contract.api.user_system.users.userId.aggregate.GET,
    async ({ input, output, ctx }) => {
      const userId = input.params.userId;

      const { data, error } = await tryCatch(
        async () => await this.userService.getUserAggregate(userId),
        "getting user aggregate",
      );

      if (error) throw new ServiceError(error.message);

      const {
        wallet: wallets,
        user_profile: profiles,
        user_project: projects,
        user_achievement: achievements,
        user_certificate: certificates,
        user_settings: settings,
        ...userData
      } = data;

      return output(200, {
        status: "success",
        message: "User aggregate fetched successfully",
        data: {
          ...userData,
          wallets,
          profiles,
          projects,
          achievements,
          certificates,
          settings,
        },
      });
    },
  );
}

export const userSystemControllerInstance = new UserSystemController();
