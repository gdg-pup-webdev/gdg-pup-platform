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

export class UserSystemController {
  constructor(
    private userService: UserService = userServiceInstance,
    private profileService: ProfileService = profileServiceInstance,
    private walletService: WalletService = walletServiceInstance,
    private transactionService: TransactionService = transactionServiceInstance,
    private roleService: RoleService = roleServiceInstance,
    private projectService: ProjectService = projectServiceInstance
  ) {}

  getUserById: RequestHandler = async (req: any, res: any) => {
    const userId = req.params.userId;
    const { data, error } = await this.userService.getUserById(userId);
    if (error) {
      return res.status(400).json({ error });
    }
    return res.status(200).json({ data });
  };

  getUserProfile: RequestHandler = async (req: any, res: any) => {
    const userId = req.params.userId;
    const { data, error } =
      await this.profileService.getUserProfileByUserId(userId);
    if (error) {
      return res.status(400).json({ error });
    }
    return res.status(200).json({ data });
  };

  getUserWallet: RequestHandler = async (req: any, res: any) => {
    const userId = req.params.userId;
    const { data, error } = await this.walletService.getWalletByUserId(userId);
    if (error) {
      return res.status(400).json({ error });
    }
    return res.status(200).json({ data });

    // To be implemented
  };

  listUserWalletTransactions: RequestHandler = async (req: any, res: any) => {
    const userId = req.params.userId;
    const { data, error } =
      await this.transactionService.listTransactionsOfUser(userId);
    if (error) {
      return res.status(400).json({ error });
    }
    return res.status(200).json({ data });
  };

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
