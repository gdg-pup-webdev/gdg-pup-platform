import { Router } from "express";
import {
  PermissionController,
  permissionControllerInstance,
} from "./permission.controller";

export class PermissionRouter {
  constructor(
    private permissionController: PermissionController = permissionControllerInstance,
  ) {}

  getRouter = (): Router => {
    const router = Router();

    return router;
  };
}

export const permissionRouterInstance = new PermissionRouter();
