import { RequestHandler } from "express";
import { UserService, userServiceInstance } from "./user.service.js";
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
} from "../rbacSystem/role.service.js";
import {
  ProjectService,
  projectServiceInstance,
} from "../userResourceSystem/project.service.js";
import { contract } from "@packages/nexus-api-contracts";
import { ServerError, ServiceError } from "@/classes/ServerError.js";
import { createExpressController } from "@packages/typed-rest";
import { ProfileService, profileServiceInstance } from "./profile.service.js";
import { tryCatch } from "@/utils/tryCatch.util.js";

export class UserSystemController {
  constructor(
    private userService: UserService = userServiceInstance,
    private profileService: ProfileService = profileServiceInstance,
    private walletService: WalletService = walletServiceInstance,
    private transactionService: TransactionService = transactionServiceInstance,
    private roleService: RoleService = roleServiceInstance,
    private projectService: ProjectService = projectServiceInstance,
  ) {}

  getUserById: RequestHandler = createExpressController(
    contract.api.user_system.users.userId.GET,
    async ({ input, output, ctx }) => {
      const { res, req } = ctx;
      const userId = input.params.userId;
      const { data, error } = await tryCatch(
        async () => await this.userService.getUserById(userId),
        "getting user",
      );

      if (error) throw new ServiceError(error.message);

      return output(200, {
        status: "success",
        message: "User fetched successfully",
        data,
      });
    },
  );

  getUserProfile: RequestHandler = createExpressController(
    contract.api.user_system.users.userId.profile.GET,
    async ({ input, output, ctx }) => {
      const userId = input.params.userId;

      const { data, error } = await tryCatch(
        async () => await this.profileService.getUserProfileByUserId(userId),
        "getting user profile",
      );

      if (error) throw new ServiceError(error.message);

      return output(200, {
        status: "success",
        message: "User profile fetched successfully",
        data,
      });
    },
  );

  getUserWallet: RequestHandler = createExpressController(
    contract.api.user_system.users.userId.wallet.GET,
    async ({ input, output, ctx }) => {
      const userId = input.params.userId;
      const { data, error } = await tryCatch(
        async () => await this.walletService.getWalletByUserId(userId),
        "getting user wallet",
      );

      if (error) throw new ServiceError(error.message);

      return output(200, {
        status: "success",
        message: "User wallet fetched successfully",
        data,
      });
    },
  );

  listUserWalletTransactions: RequestHandler = createExpressController(
    contract.api.user_system.users.userId.wallet.transactions.GET,
    async ({ input, output, ctx }) => {
      const userId = input.params.userId;
      const { data, error } = await tryCatch(
        async () =>
          await this.transactionService.listTransactionsOfUser(userId),
        "getting user wallet transactions",
      );

      if (error) throw new ServiceError(error.message);

      return output(200, {
        status: "success",
        message: "User wallet transactions fetched successfully",
        data: data.list,
        meta: {
          totalRecords: data.count,
          totalPages: Math.ceil(data.count / input.query.page.size),
          currentPage: input.query.page.number,
          pageSize: input.query.page.size,
        },
      });
    },
  );

  listUserRoles: RequestHandler = createExpressController(
    contract.api.user_system.users.userId.roles.GET,
    async ({ input, output, ctx }) => {
      const userId = input.params.userId;
      const { data, error } = await tryCatch(
        async () => await this.roleService.getRolesOfUser(userId),
        "getting user roles",
      );
      if (error) throw new ServiceError(error.message);

      return output(200, {
        status: "success",
        message: "User roles fetched successfully",
        data: data.list,
        meta: {
          totalRecords: data.count,
          totalPages: Math.ceil(data.count / input.query.page.size),
          currentPage: input.query.page.number,
          pageSize: input.query.page.size,
        },
      });
    },
  );

  listUserProjects: RequestHandler = createExpressController(
    contract.api.user_system.users.userId.projects.GET,
    async ({ input, output, ctx }) => {
      const userId = input.params.userId;
      const { data, error } = await tryCatch(
        async () => await this.projectService.listProjects(userId),
        "getting user projects",
      );

      if (error) throw new ServiceError(error.message);

      return output(200, {
        status: "success",
        message: "User projects fetched successfully",
        data: data.list,
      });
    },
  );
}

export const userSystemControllerInstance = new UserSystemController();
