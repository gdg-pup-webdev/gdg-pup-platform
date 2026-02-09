/**
 * @file user.controller.ts
 * @description Controller for the User System module. Handles requests for user listing,
 * individual user retrieval, and complex user aggregate fetching (including all related resources).
 */

import { RequestHandler } from "express";
import { UserService, userServiceInstance } from "./user.service.js";
import { contract } from "@packages/nexus-api-contracts";
import { createExpressController } from "@packages/typed-rest";

/**
 * UserSystemController
 * Orchestrates the handling of user-related API requests.
 */
export class UserSystemController {
  /**
   * @param userService - Service layer for user-specific business logic.
   */
  constructor(
    private readonly userService: UserService = userServiceInstance,
  ) {}

  /**
   * listUsers
   * GET /api/user-system/users
   * Retrieves a list of all users in the system.
   */
  listUsers: RequestHandler = async (_req, res) => {
    const data = await this.userService.listUsers();

    return res.status(200).json({
      status: "success",
      message: "Users fetched successfully",
      data,
    });
  };

  /**
   * getUserById
   * GET /api/user-system/users/:userId
   * Retrieves basic information for a specific user.
   */
  getUserById: RequestHandler = createExpressController(
    contract.api.user_system.users.userId.GET,
    async ({ input, output }) => {
      const userId = input.params.userId;
      const data = await this.userService.getUserById(userId);

      return output(200, {
        status: "success",
        message: "User fetched successfully",
        data,
      });
    },
  );

  /**
   * getUserAggregate
   * GET /api/user-system/users/:userId/aggregate
   * Fetches a comprehensive "aggregate" view of a user, including their
   * wallets, profiles, projects, achievements, certificates, and settings.
   */
  getUserAggregate: RequestHandler = createExpressController(
    contract.api.user_system.users.userId.aggregate.GET,
    async ({ input, output }) => {
      const userId = input.params.userId;

      const data = await this.userService.getUserAggregate(userId);

      /**
       * Map database relation names to the schema names defined in the API contract.
       * Achievement, Certificate, and Settings are newly added to this aggregate.
       */
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

/**
 * Exported singleton instance of UserSystemController.
 */
export const userSystemControllerInstance = new UserSystemController();
