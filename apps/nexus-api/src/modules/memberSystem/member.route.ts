import { Router } from "express";
import { MemberController, memberController } from "./member.controller.js";

export class MemberRouter {
  constructor(
    private readonly controller: MemberController = memberController,
  ) {}

  getRouter(): Router {
    const router = Router();
    router.get("/check-membership", this.controller.checkMembership);
    return router;
  }
}

export const memberSystemRouterInstance = new MemberRouter();
