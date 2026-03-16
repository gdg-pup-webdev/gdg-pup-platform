import { Router } from "express";
import {
  AuthMiddleware,
  authMiddlewareInstance,
} from "@/v1/middlewares/auth.middleware";
import { GdgTeamsHttpController } from "./gdgTeams.controller";

export class GdgTeamsRouter {
  router: Router;

  constructor(
    private readonly controller: GdgTeamsHttpController,
    private readonly authMiddleware: AuthMiddleware = authMiddlewareInstance,
  ) {
    this.router = Router();

    this.router.get(
      "/",
      this.authMiddleware.requirePermissions({ "gdg-teams": ["read"] }),
      this.controller.listTeams,
    );
    this.router.post(
      "/",
      this.authMiddleware.requirePermissions({ "gdg-teams": ["create"] }),
      this.controller.createTeam,
    );
    this.router.get(
      "/:gdgTeamId",
      this.authMiddleware.requirePermissions({ "gdg-teams": ["read"] }),
      this.controller.getOneTeam,
    );
    this.router.patch(
      "/:gdgTeamId",
      this.authMiddleware.requirePermissions({ "gdg-teams": ["update"] }),
      this.controller.updateTeam,
    );
    this.router.delete(
      "/:gdgTeamId",
      this.authMiddleware.requirePermissions({ "gdg-teams": ["delete"] }),
      this.controller.deleteTeam,
    );

    this.router.get(
      "/:gdgTeamId/members",
      this.authMiddleware.requirePermissions({ "gdg-teams": ["read"] }),
      this.controller.listMembers,
    );
    this.router.post(
      "/:gdgTeamId/members",
      this.authMiddleware.requirePermissions({ "gdg-teams": ["create"] }),
      this.controller.addMember,
    );
    this.router.get(
      "/:gdgTeamId/members/:memberId",
      this.authMiddleware.requirePermissions({ "gdg-teams": ["read"] }),
      this.controller.getMember,
    );
    this.router.delete(
      "/:gdgTeamId/members/:memberId",
      this.authMiddleware.requirePermissions({ "gdg-teams": ["delete"] }),
      this.controller.deleteMember,
    );
  }
}
