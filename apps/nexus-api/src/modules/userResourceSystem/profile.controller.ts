import { ServiceError } from "@/classes/ServerError";
import {
  ProfileService,
  profileServiceInstance,
} from "@/modules/userResourceSystem/profile.service";
import { tryCatch } from "@/utils/tryCatch.util";
import { contract } from "@packages/nexus-api-contracts";
import { createExpressController } from "@packages/typed-rest";
import { RequestHandler } from "express";

export class ProfileController {
  constructor(
    private profileService: ProfileService = profileServiceInstance,
  ) {}

  listProfiles: RequestHandler = createExpressController(
    contract.api.user_resource_system.profiles.GET,
    async ({ input, output, ctx }) => {
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

        if (error) throw new ServiceError(error.message);

        list = [data];
        count = 1;
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

        if (error) throw new ServiceError(error.message);

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
}

export const profileControllerInstance = new ProfileController();
