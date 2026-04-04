import { Router } from "express";
import {
  AuthMiddleware,
  authMiddlewareInstance,
} from "@/v1/middlewares/auth.middleware";
import { GdgTeamsHttpController } from "./gdgTeams.controller";
import { requirePermissions } from "@/v1/middlewares/rbac.middleware";

export class GdgTeamsRouter {
  router: Router;

  constructor(
    private readonly controller: GdgTeamsHttpController,
    private readonly authMiddleware: AuthMiddleware = authMiddlewareInstance,
  ) {
    this.router = Router();

    this.router.get(
      "/", 
      // this.authMiddleware.requirePermissions({ "gdg-teams": ["read"] }),
      this.controller.listTeams,
    );
    this.router.post(
      "/",
      requirePermissions({ "gdg-teams": ["create"] }),
      // this.authMiddleware.requirePermissions({ "gdg-teams": ["create"] }),
      this.controller.createTeam,
    );
    this.router.get(
      "/search", 
      // this.authMiddleware.requirePermissions({ "gdg-teams": ["read"] }),
      this.controller.searchTeams,
    );
    this.router.get(
      "/:gdgTeamId",
      requirePermissions({ "gdg-teams": ["read"] }),
      // this.authMiddleware.requirePermissions({ "gdg-teams": ["read"] }),
      this.controller.getOneTeam,
    );
    this.router.patch(
      "/:gdgTeamId",
      requirePermissions({ "gdg-teams": ["update"] }),
      // this.authMiddleware.requirePermissions({ "gdg-teams": ["update"] }),
      this.controller.updateTeam,
    );
    this.router.delete(
      "/:gdgTeamId",
      requirePermissions({ "gdg-teams": ["delete"] }),
      // this.authMiddleware.requirePermissions({ "gdg-teams": ["delete"] }),
      this.controller.deleteTeam,
    );

    this.router.get(
      "/:gdgTeamId/members",
      // this.authMiddleware.requirePermissions({ "gdg-teams": ["read"] }),
      this.controller.listMembers,
    );
    this.router.post(
      "/:gdgTeamId/members",
      // this.authMiddleware.requirePermissions({ "gdg-teams": ["create"] }),
      this.controller.addMember,
    );
    this.router.get(
      "/:gdgTeamId/members/:memberId",
      // this.authMiddleware.requirePermissions({ "gdg-teams": ["read"] }),
      this.controller.getMember,
    );
    this.router.patch(
      "/:gdgTeamId/members/:memberId",
      // this.authMiddleware.requirePermissions({ "gdg-teams": ["update"] }),
      this.controller.updateMember,
    );
    this.router.delete(
      "/:gdgTeamId/members/:memberId",
      // this.authMiddleware.requirePermissions({ "gdg-teams": ["delete"] }),
      this.controller.deleteMember,
    );
  }
}
