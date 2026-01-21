import { Router } from "express";
import { TeamController, teamControllerInstance } from "./team.controller";
import {
  AuthMiddleware,
  authMiddlewareInstance,
} from "@/middlewares/auth.middleware";
import {
  MemberController,
  memberControllerInstance,
} from "./member.controller";

export class MemberRouter {
  constructor(
    private memberController: MemberController = memberControllerInstance,
    private authMiddleware: AuthMiddleware = authMiddlewareInstance,
  ) {}

  getRouter = (): Router => {
    const router = Router();

    router.get("/", this.memberController.listMembersWithFilter);

    router.post("/", this.memberController.createMember);

    router.delete("/:memberId", this.memberController.deleteMember);

    return router;
  };
}

export const memberRouterInstance = new MemberRouter();
