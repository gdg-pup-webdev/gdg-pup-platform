import { Router } from "express";
<<<<<<< HEAD:apps/nexus-api/src/presentation/routes/v1/members/member.route.ts
import { MembersHttpController } from "./member.controller.js";

export class MemberRouter {
  constructor(private readonly controller: MembersHttpController) {}
=======
import { MemberController, memberController } from "./member.controller.js";

export class MemberRouter {
  constructor(
    private readonly controller: MemberController = memberController,
  ) {}
>>>>>>> dev:apps/nexus-api/src/v1/modules/memberSystem/member.route.ts

  getRouter(): Router {
    const router = Router();
    router.get("/check-membership", this.controller.checkMembership);
    return router;
  }
}
<<<<<<< HEAD:apps/nexus-api/src/presentation/routes/v1/members/member.route.ts
=======

export const memberSystemRouterInstance = new MemberRouter();
>>>>>>> dev:apps/nexus-api/src/v1/modules/memberSystem/member.route.ts
