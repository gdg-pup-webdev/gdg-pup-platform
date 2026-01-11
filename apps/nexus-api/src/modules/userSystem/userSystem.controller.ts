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
import { createExpressController } from "@packages/api-typing";
import { Contract } from "@packages/nexus-api-contracts";
import { ServerError } from "@/classes/ServerError.js";

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
    Contract.userSystem.users.user.get,
    async ({ input, output, ctx }) => {
      const { res, req } = ctx;
      const userId = input.params.userId;
      const { data, error } = await this.userService.getUserById(userId);
      if (error) {
        throw new ServerError(400, "Bad Request", error.message);
      }
      return output(200, {
        status: "success",
        message: "User fetched successfully",
        data,
      });
    }
  );

  getUserProfile: RequestHandler = createExpressController(
    Contract.userSystem.users.user.profile.get,
    async ({ input, output, ctx }) => {
      const userId = input.params.userId;

      const { data, error } =
        await this.profileService.getUserProfileByUserId(userId);

      if (error) {
        throw new ServerError(400, "Bad Request", error.message);
      }

      return output(200, {
        status: "success",
        message: "User profile fetched successfully",
        data,
      });
    }
  );

  getUserWallet: RequestHandler = createExpressController(
    Contract.userSystem.users.user.wallet.get,
    async ({ input, output, ctx }) => {
      const userId = input.params.userId;
      const { data, error } =
        await this.walletService.getWalletByUserId(userId);

      if (error) {
        throw new ServerError(400, "Bad Request", error.message);
      }

      return output(200, {
        status: "success",
        message: "User wallet fetched successfully",
        data,
      });
    }
  );

  listUserWalletTransactions: RequestHandler = createExpressController(
    Contract.userSystem.users.user.wallet.transactions.list,
    async ({ input, output, ctx }) => {
      const userId = input.params.userId;
      const { data, error } =
        await this.transactionService.listTransactionsOfUser(userId);
      if (error) {
        throw new ServerError(400, "Bad Request", error.message);
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

  listUserRoles: RequestHandler = async (req: any, res: any) => {
    const userId = req.params.userId;
    const { data, error } = await this.roleService.getRolesOfUser(userId);
    if (error) {
      return res.status(400).json({ error });
    }
    return res.status(200).json({ data });
  };

  listUserProjects: RequestHandler = async (req: any, res: any) => {
    const userId = req.params.userId;
    const { data, error } =
      await this.projectService.listProjectsOfUser(userId);
    if (error) {
      return res.status(400).json({ error });
    }
    return res.status(200).json({ data });
  };
}

export const userSystemControllerInstance = new UserSystemController();
