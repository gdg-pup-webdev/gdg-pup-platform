import { Router } from "express";
import { GdgMembersHttpController } from "./gdgmembers.controller";

export class GdgMembersRouter {
  router: Router;

  constructor(private readonly controller: GdgMembersHttpController) {
    this.router = Router();

    this.router.get("/", this.controller.get);
    this.router.post("/", this.controller.post);
    this.router.get("/:id", this.controller.getIdGet);
    this.router.patch("/:id", this.controller.getIdPatch);
    this.router.delete("/:id", this.controller.getIdDelete);
    this.router.post("/:id/make-private", this.controller.getIdMakePrivatePost);
    this.router.post("/:id/make-public", this.controller.getIdMakePublicPost); 
    this.router.post("/:id/profile-image", this.controller.changeProfileImage);
  }
}
