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

    /**
     * PUBLIC ROUTES
     */

    /**
     * PRIVATE ROUTES 
     */
    this.router.use(requirePermissions({
      "gdg-teams": ["queries", "mutations"], 
    }))
    
    this.router.get("/", this.controller.listTeams);
    this.router.post("/", this.controller.createTeam);
    this.router.get("/search", this.controller.searchTeams);
    this.router.get("/:gdgTeamId", this.controller.getOneTeam);
    this.router.patch("/:gdgTeamId", this.controller.updateTeam);
    this.router.delete("/:gdgTeamId", this.controller.deleteTeam);

    this.router.get("/:gdgTeamId/members", this.controller.listMembers);
    this.router.post("/:gdgTeamId/members", this.controller.addMember);
    this.router.get("/:gdgTeamId/members/:memberId", this.controller.getMember);
    this.router.patch(
      "/:gdgTeamId/members/:memberId",
      this.controller.updateMember,
    );
    this.router.delete(
      "/:gdgTeamId/members/:memberId",
      this.controller.deleteMember,
    );
  }
}
