import { Router } from "express";
import { UsersHttpController } from "./users.controller";

export class UsersRouter {
  router: Router;

  constructor(private usersHttpController: UsersHttpController) {
    // private filesHttpController: FilesHttpController,
    // private authMiddleware: AuthMiddleware = authMiddlewareInstance,
    this.router = Router();

    this.router.get("/:userId/roles", this.usersHttpController.listRoles);
    this.router.post("/:userId/roles", this.usersHttpController.assignRole);
    this.router.delete("/:userId/roles/:id", this.usersHttpController.unassignRole);
  }
}
