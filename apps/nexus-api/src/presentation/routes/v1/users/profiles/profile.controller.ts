import { ProfileService } from "@/modules/userResourceSystem/profiles/profile.service";
import { contract } from "@packages/nexus-api-contracts";
import { createExpressController } from "@packages/typed-rest/serverExpress";
import { RequestHandler } from "express";

export class ProfilesHttpController {
  constructor(private readonly profileService: ProfileService) {}

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
        const data = await this.profileService.getUserProfileByUserId(userId);

        list = data ? data.list : [];
        count = data ? data.count : 0;
      } else {
        /**
         * ALL PROFILES
         */
        const data = await this.profileService.listProfilesPaginated(
          pageNumber,
          pageSize,
        );

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
      const data = await this.profileService.createProfile(dto);

      return output(201, {
        status: "success",
        message: "Profile created successfully",
        data,
      });
    },
  );
}
