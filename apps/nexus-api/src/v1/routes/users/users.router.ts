import { Router } from "express";
import { UsersHttpController } from "./users.controller";

export class UsersRouter {
  router: Router;

  constructor(private usersHttpController: UsersHttpController) {
    // private filesHttpController: FilesHttpController,
    // private authMiddleware: AuthMiddleware = authMiddlewareInstance,
    this.router = Router();

    this.router.get("/", this.usersHttpController.listUsers);
    this.router.get("/search", this.usersHttpController.searchUsers);
    this.router.get("/:userId", this.usersHttpController.getUser);

    this.router.get("/:userId/roles", this.usersHttpController.listRoles);
    this.router.post("/:userId/roles", this.usersHttpController.assignRole);
    this.router.delete("/:userId/roles/:roleId", this.usersHttpController.unassignRole);
  }
}
