import { Router, Express } from "express";
import { FilesRouter } from "./files/files.router";
import { AuthRouter } from "./auth/auth.route";
import { EventsRouter } from "./events/event.route";
import { HealthRouter } from "./health/healthCheck.route";
import { LearningResourcesRouter } from "./learning-resources/learningResources.route";
import { ArticlesRouter } from "./articles/article.route";
import { RewardsRouter } from "./rewards/reward.route";
import { StudyJamsRouter } from "./studyJams/studyJam.route";
import { TeamsRouter } from "./teams/team.route";
import { UsersRouter } from "./users/user.route";

export class ApiVersion1Router {
  router: Router;

  constructor(
    private filesRouter: FilesRouter,
    private authRouter: AuthRouter,
    private eventsRouter: EventsRouter,
    private healthRouter: HealthRouter,
    private learningResourcesRouter: LearningResourcesRouter,
    private articlesRouter: ArticlesRouter,
    private rewardsRouter: RewardsRouter,
    private studyJamsRouter: StudyJamsRouter,
    private teamsRouter: TeamsRouter,
    private usersRouter: UsersRouter,
  ) {
    this.router = Router();

    this.router.use("/files", this.filesRouter.router);
    this.router.use("/auth", this.authRouter.router);
    this.router.use("/events", this.eventsRouter.router);
    this.router.use("/health", this.healthRouter.router);
    this.router.use("/learning-resources", this.learningResourcesRouter.router);
    this.router.use("/articles", this.articlesRouter.router);
    this.router.use("/rewards", this.rewardsRouter.router);
    this.router.use("/study-jams", this.studyJamsRouter.router);
    this.router.use("/teams", this.teamsRouter.router);
    this.router.use("/users", this.usersRouter.router);

    this.router.get("/", (req, res) => {
      res.status(200).json({ message: "Nexus API v1" });
    });
  }
}
