import { Router } from "express";
import { TasksHttpController } from "./tasks.controller";
import { requirePermissions } from "@/v1/middlewares/rbac.middleware";
import { requireAuthenticated } from "@/v1/middlewares/auth.middleware";

export class TasksRouter {
  router: Router;

  constructor(private readonly controller: TasksHttpController) {
    this.router = Router();

    /**
     * PUBLIC ROUTES 
     */

    /**
     * AUTHENTICATED ROUTES 
     */
    this.router.use(requireAuthenticated());
    this.router.get("/", this.controller.listTasks);
    this.router.get("/:taskId", this.controller.getTaskById);
    this.router.post("/:taskId/complete", this.controller.completeTask);

    /**
     * PRIVATE ROUTES 
     */
    this.router.use(requirePermissions({
      tasks: ["mutations"],
    }))
    this.router.post("/", this.controller.createTask);
    this.router.patch("/:taskId", this.controller.updateTask);
  }
}
