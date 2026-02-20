import { Router } from "express";
import { MembersHttpController  } from "./member.controller.js";

export class MemberRouter {
  constructor(
    private readonly controller: MembersHttpController ,
  ) {}

  getRouter(): Router {
    const router = Router();
    router.get("/check-membership", this.controller.checkMembership);
    return router;
  }
}
 