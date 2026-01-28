import { Router } from "express";
import { TeamRouter, teamRouterInstance } from "./teams/team.route.js";
import { MemberRouter, memberRouterInstance } from "./members/member.route.js";

export class teamSystemRouter {
  constructor(
    private readonly teamRouter: TeamRouter = teamRouterInstance,
    private readonly memberRouter: MemberRouter = memberRouterInstance,
  ) {}

  getRouter = (): Router => {
    const router = Router();

    router.use("/teams", this.teamRouter.getRouter());
    router.use("/members", this.memberRouter.getRouter());

    return router;
  };
}

export const teamSystemRouterInstance = new teamSystemRouter();
