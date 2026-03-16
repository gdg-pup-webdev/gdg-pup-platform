import { Router } from "express";
import { GdgTeamsHttpController } from "./gdgTeams.controller";

export class GdgTeamsRouter {
  router: Router;

  constructor(private readonly controller: GdgTeamsHttpController) {
    this.router = Router();

    this.router.get("/", this.controller.listTeams);
    this.router.post("/", this.controller.createTeam);
    this.router.get("/:gdgTeamId", this.controller.getOneTeam);
    this.router.patch("/:gdgTeamId", this.controller.updateTeam);
    this.router.delete("/:gdgTeamId", this.controller.deleteTeam);

    this.router.get("/:gdgTeamId/members", this.controller.listMembers);
    this.router.post("/:gdgTeamId/members", this.controller.addMember);
    this.router.get("/:gdgTeamId/members/:memberId", this.controller.getMember);
    this.router.delete(
      "/:gdgTeamId/members/:memberId",
      this.controller.deleteMember,
    );
  }
}
