import { Router } from "express";
import {
  ProfileController,
  profileControllerInstance,
} from "./profile.controller";

export class ProfileRouter {
  constructor(
    private profileController: ProfileController = profileControllerInstance,
  ) {}

  getRouter = (): Router => {
    const router = Router();

    router.get("/", this.profileController.listProfiles);

    return router;
  };
}

export const profileRouterInstance = new ProfileRouter();
