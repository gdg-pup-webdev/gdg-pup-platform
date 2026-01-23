import { Router } from "express";
import { UserRouter, userRouterInstance } from "./user.route";

export class UserSystemRouter {
  constructor(private userRouter: UserRouter = userRouterInstance) {}

  getRouter(): Router {
    const router = Router();
    router.use("/users", this.userRouter.getRouter());
    return router;
  }
}

export const userSystemRouterInstance = new UserSystemRouter();
