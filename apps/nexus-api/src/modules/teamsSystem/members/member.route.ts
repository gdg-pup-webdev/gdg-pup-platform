import { Router } from "express";
import {
  MemberController,
  memberControllerInstance,
} from "./member.controller.js";

export class MemberRouter {
  constructor(
    private readonly memberController: MemberController = memberControllerInstance,
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
