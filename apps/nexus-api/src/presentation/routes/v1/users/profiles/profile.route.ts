import { Router } from "express";
import { ProfilesHttpController } from "./profile.controller";

export class ProfilesRouter {
  router: Router;
  constructor(private profileController: ProfilesHttpController) {
    this.router = Router();

    this.router.get("/", this.profileController.listProfiles);
    this.router.post("/", this.profileController.createProfile);
  }
}
