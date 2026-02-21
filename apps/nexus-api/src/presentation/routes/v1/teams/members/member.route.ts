import { Router } from "express";
import { MembersHttpController } from "./member.controller.js";

export class MembersRouter {
  router: Router;
  constructor(private readonly memberController: MembersHttpController) {
    this.router = Router();

    this.router.get("/", this.memberController.listMembersWithFilter);

    this.router.post("/", this.memberController.createMember);

    this.router.delete("/:memberId", this.memberController.deleteMember);
  }
}
