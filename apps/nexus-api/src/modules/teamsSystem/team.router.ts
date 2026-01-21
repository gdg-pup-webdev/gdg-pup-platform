import { Router } from "express";
import { TeamController, teamControllerInstance } from "./team.controller";
import {
  AuthMiddleware,
  authMiddlewareInstance,
} from "@/middlewares/auth.middleware";

export class TeamRouter {
  constructor(
    private teamController: TeamController = teamControllerInstance,
    private authMiddleware: AuthMiddleware = authMiddlewareInstance,
  ) {}

  getRouter = (): Router => {
    const router = Router();

    router.get("/", this.teamController.listTeams);

    router.post(
      "/",
      this.authMiddleware.requireAuth(),
      this.teamController.createTeam,
    );

    router.get("/:teamId", this.teamController.getOneTeam);

    router.patch("/:teamId", this.teamController.updateTeam);

    router.delete("/:teamId", this.teamController.deleteTeam);
 

    return router;
  };
}

export const teamRouterInstance = new TeamRouter();
