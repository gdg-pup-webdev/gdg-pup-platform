import { Router } from "express";
import { TasksHttpController } from "./tasks.controller";

export class TasksRouter {
  router: Router;

  constructor(private readonly controller: TasksHttpController) {
    this.router = Router();

    this.router.get("/", this.controller.listTasks);
    this.router.post("/", this.controller.createTask);
    this.router.get("/:taskId", this.controller.getTaskById);
    this.router.patch("/:taskId", this.controller.updateTask);
    this.router.post("/:taskId/complete", this.controller.completeTask);
  }
}
