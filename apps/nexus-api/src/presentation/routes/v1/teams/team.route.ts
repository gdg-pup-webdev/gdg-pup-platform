import { Router } from "express";
import { TeamsHttpController } from "./team.controller.js";
import { AuthMiddleware } from "@/presentation/middlewares/auth.middleware.js";
import { MembersRouter } from "./members/member.route.js";

export class TeamsRouter {
  router: Router;

  constructor(
    private readonly teamController: TeamsHttpController,
    private readonly authMiddleware: AuthMiddleware,
    private readonly memberRouter: MembersRouter,
  ) {
    this.router = Router();

    this.router.get("/", this.teamController.listTeams);

    this.router.post(
      "/",
      this.authMiddleware.requireAuth(),
      this.teamController.createTeam,
    );

    this.router.get("/:teamId", this.teamController.getOneTeam);

    this.router.patch("/:teamId", this.teamController.updateTeam);

    this.router.delete("/:teamId", this.teamController.deleteTeam);

    this.router.use("/members", this.memberRouter.router);
  }
}
