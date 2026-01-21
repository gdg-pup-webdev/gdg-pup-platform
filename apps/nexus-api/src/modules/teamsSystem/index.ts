import { Router } from "express";
import { TeamRouter, teamRouterInstance } from "./team.router";
import { MemberRouter, memberRouterInstance } from "./member.route";

export class teamSystemRouter {
  constructor(
    private teamRouter: TeamRouter = teamRouterInstance,
    private memberRouter: MemberRouter = memberRouterInstance,
  ) {}

  getRouter = (): Router => {
    const router = Router();

    router.use("/teams", this.teamRouter.getRouter());
    router.use("/members", this.memberRouter.getRouter());

    return router;
  };
}

export const teamSystemRouterInstance = new teamSystemRouter();
