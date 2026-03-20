import { Router } from "express";
import { TeamResourcesHttpController } from "./team-resources.controller";

export class TeamResourcesRouter {
  router: Router;

  constructor(private controller: TeamResourcesHttpController) {
    this.router = Router();
    this.init();
  }

  private init() {
    /**
     * @route GET /api/v1/team-resources
     * @desc List team resources
     */
    this.router.get("/", this.controller.listResources);

    /**
     * @route POST /api/v1/team-resources
     * @desc Create a new team resource
     */
    this.router.post("/", this.controller.createResource);

    /**
     * @route GET /api/v1/team-resources/:teamResourceId
     * @desc Get team resource by ID
     */
    this.router.get("/:teamResourceId", this.controller.getResourceById);

    /**
     * @route PATCH /api/v1/team-resources/:teamResourceId
     * @desc Update an existing team resource
     */
    this.router.patch("/:teamResourceId", this.controller.updateResource);

    /**
     * @route DELETE /api/v1/team-resources/:teamResourceId
     * @desc Delete a team resource
     */
    this.router.delete("/:teamResourceId", this.controller.deleteResource);
  }
}
