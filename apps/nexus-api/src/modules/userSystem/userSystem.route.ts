import { Router } from "express";
import {
  UserSystemController,
  userSystemControllerInstance,
} from "./userSystem.controller.js";
import {
  projectRotuerInstance,
  ProjectRouter,
} from "../userResourceSystem/project.route.js";
import {
  WalletRouter,
  walletRouterInstance,
} from "../economySystem/wallet.route.js";
import {
  ProfileRouter,
  profileRouterInstance,
} from "../userResourceSystem/profile.router.js";
import {
  RoleRouter,
  roleRouterInstance,
} from "../rbacSystem/role.route.js";

export class UserSystemRouter {
  constructor(
    private userSystemController: UserSystemController = userSystemControllerInstance,
    private userProjectRouter: ProjectRouter = projectRotuerInstance,
    private walletRouter: WalletRouter = walletRouterInstance,
    private profileRouter: ProfileRouter = profileRouterInstance,
    private roleRouter: RoleRouter = roleRouterInstance,
  ) {}

  getRouter() {
    const router: Router = Router();

    router.get("/users", this.userSystemController.listUsers);

    router.get("/users/:userId", this.userSystemController.getUserById);

     
    // router.get("/users/:userId/wallet", this.walletRouter.getRouter());

    // router.use("/users/:userId/roles", this.roleRouter.getRouter());

    // router.use("/users/:userId/projects", this.userProjectRouter.getRouter());

    // router.use("/users/:userId/profile", this.profileRouter.getRouter());

    return router;
  }
}

export const userSystemRouterInstance = new UserSystemRouter();
