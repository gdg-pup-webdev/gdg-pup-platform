import { Router } from "express";
import { LearningResourcesHttpController } from "./learning-resources.controller";
import { requirePermissions } from "@/v1/middlewares/rbac.middleware";

export class LearningResourcesRouter {
  router: Router;

  constructor(private controller: LearningResourcesHttpController) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {

    /**
     * PUBLIC ROUTES 
     */
    this.router.get("/", this.controller.listResources);
    this.router.get("/:learningResourceId", this.controller.getResourceById);

    /**
     * PRIVATE ROUTES 
     */
    this.router.use(requirePermissions({
      "learning_resources": ["mutations"],
    }))
    
    this.router.post("/", this.controller.createResource);
    this.router.patch("/:learningResourceId", this.controller.updateResource);
    this.router.delete("/:learningResourceId", this.controller.deleteResource);
  }
}
