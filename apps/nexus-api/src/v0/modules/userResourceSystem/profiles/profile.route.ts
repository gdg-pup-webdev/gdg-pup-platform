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
    router.post("/", this.profileController.createProfile);

    return router;
  };
}

export const profileRouterInstance = new ProfileRouter();
