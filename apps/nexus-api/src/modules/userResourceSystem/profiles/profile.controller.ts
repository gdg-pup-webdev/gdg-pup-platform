import { ServiceError_DEPRECATED } from "@/classes/ServerError.js";
import {
  ProfileService,
  profileServiceInstance,
} from "./profile.service.js";
import { tryCatch } from "@/utils/tryCatch.util.js";
import { contract } from "@packages/nexus-api-contracts";
import { createExpressController } from "@packages/typed-rest";
import { RequestHandler } from "express";

export class ProfileController {
  constructor(
    private readonly profileService: ProfileService = profileServiceInstance,
  ) {}

  listProfiles: RequestHandler = createExpressController(
    contract.api.user_resource_system.profiles.GET,
    async ({ input, output }) => {
      // PAGINATION OPTIONS
      const pageNumber = input.query.pageNumber;
      const pageSize = input.query.pageSize;

      // getting filters
      const userId = input.query.userId || null;

      let list, count;

      if (userId) {
        /**
         * PROFILE OF A USER
         */
        const { data, error } = await tryCatch(
          async () => await this.profileService.getUserProfileByUserId(userId),
          "getting user profile",
        );

        if (error) throw new ServiceError_DEPRECATED(error.message);

        list = data ? data.list : [];
        count = data ? data.count : 0;
      } else {
        /**
         * ALL PROFILES
         */
        const { data, error } = await tryCatch(
          async () =>
            await this.profileService.listProfilesPaginated(
              pageNumber,
              pageSize,
            ),
          "getting profiles",
        );

        if (error) throw new ServiceError_DEPRECATED(error.message);

        list = data.list;
        count = data.count;
      }

      return output(200, {
        status: "success",
        message: "User profile fetched successfully",
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

  createProfile: RequestHandler = createExpressController(
    contract.api.user_resource_system.profiles.POST,
    async ({ input, output }) => {
      const dto = input.body.data;
      const { data, error } = await tryCatch(
        async () => await this.profileService.createProfile(dto),
        "creating profile",
      );

      if (error) throw new ServiceError_DEPRECATED(error.message);

      return output(201, {
        status: "success",
        message: "Profile created successfully",
        data,
      });
    },
  );
}

export const profileControllerInstance = new ProfileController();
