import { RequestHandler } from "express";
import { UserService, userServiceInstance } from "./user.service.js";
import { ProfileService, profileServiceInstance } from "./profile.service.js";
import {
  WalletService,
  walletServiceInstance,
} from "../economySystem/wallet.service.js";
import {
  TransactionService,
  transactionServiceInstance,
} from "../economySystem/transaction.service.js";
import {
  RoleService,
  roleServiceInstance,
} from "../roleSystem/role.service.js";
import {
  ProjectService,
  projectServiceInstance,
} from "../userResourceSystem/project.service.js"; 
import { contract } from "@packages/nexus-api-contracts";
import { ServerError } from "@/classes/ServerError.js";
import { Server } from "http";
import { createExpressController } from "@packages/typed-rest";

export class UserSystemController {
  constructor(
    private userService: UserService = userServiceInstance,
    private profileService: ProfileService = profileServiceInstance,
    private walletService: WalletService = walletServiceInstance,
    private transactionService: TransactionService = transactionServiceInstance,
    private roleService: RoleService = roleServiceInstance,
    private projectService: ProjectService = projectServiceInstance
  ) {}

  getUserById: RequestHandler = createExpressController(
    contract.api.user_system.users.userId.GET,
    async ({ input, output, ctx }) => {
      const { res, req } = ctx;
      const userId = input.params.userId;
      const { data, error } = await this.userService.getUserById(userId);
      if (error) {
        throw new ServerError(
          500,
          "Something happened inside the controller",
          `Message: ${error.message}`
        );
      }
      return output(200, {
        status: "success",
        message: "User fetched successfully",
        data,
      });
    }
  );

  getUserProfile: RequestHandler = createExpressController(
    contract.api.user_system.users.userId.profile.GET,
    async ({ input, output, ctx }) => {
      const userId = input.params.userId;

      const { data, error } =
        await this.profileService.getUserProfileByUserId(userId);

      if (error) {
        throw new ServerError(
          500,
          "Something happened inside the controller",
          `Message: ${error.message}`
        );
      }

      return output(200, {
        status: "success",
        message: "User profile fetched successfully",
        data,
      });
    }
  );

  getUserWallet: RequestHandler = createExpressController(
    contract.api.user_system.users.userId.wallet.GET,
    async ({ input, output, ctx }) => {
      const userId = input.params.userId;
      const { data, error } =
        await this.walletService.getWalletByUserId(userId);

      if (error) {
        throw new ServerError(
          500,
          "Something happened inside the controller",
          `Message: ${error.message}`
        );
      }

      return output(200, {
        status: "success",
        message: "User wallet fetched successfully",
        data,
      });
    }
  );

  listUserWalletTransactions: RequestHandler = createExpressController(
    contract.api.user_system.users.userId.wallet.transactions.GET,
    async ({ input, output, ctx }) => {
      const userId = input.params.userId;
      const { data, error } =
        await this.transactionService.listTransactionsOfUser(userId);
      if (error) {
        throw new ServerError(
          500,
          "Something happened inside the controller",
          `Message: ${error.message}`
        );
      }
      return output(200, {
        status: "success",
        message: "User wallet transactions fetched successfully",
        data: data.listData,
        meta: {
          totalRecords: data.count,
          totalPages: Math.ceil(data.count / input.query.page.size),
          currentPage: input.query.page.number,
          pageSize: input.query.page.size,
        },
      });
    }
  );

  listUserRoles: RequestHandler = createExpressController(
    contract.api.user_system.users.userId.roles.GET,
    async ({ input, output, ctx }) => {
      const userId = input.params.userId;
      const { data, error } = await this.roleService.getRolesOfUser(userId);
      if (error) {
        throw new ServerError(
          500,
          "Something happened inside the controller",
          `Message: ${error.message}`
        );
      }
      return output(200, {
        status: "success",
        message: "User roles fetched successfully",
        data,
      });
    }
  );

  listUserProjects: RequestHandler = createExpressController(
    contract.api.user_system.users.userId.projects.GET,
    async ({ input, output, ctx }) => {
      const userId = input.params.userId;
      const { data, error } =
        await this.projectService.listProjectsOfUser(userId);
      if (error) {
        throw new ServerError(
          500,
          "Something happened inside the controller",
          `Message: ${error.message}`
        );
      }
      return output(200, {
        status: "success",
        message: "User projects fetched successfully",
        data,
      });
    }
  );
}

export const userSystemControllerInstance = new UserSystemController();
