import { Router } from "express";
import { UserRouter, userRouterInstance } from "./users/user.route.js";

export class UserSystemRouter {
  constructor(private readonly userRouter: UserRouter = userRouterInstance) {}

  getRouter(): Router {
    const router = Router();
    router.use("/users", this.userRouter.getRouter());
    return router;
  }
}

export const userSystemRouterInstance = new UserSystemRouter();
