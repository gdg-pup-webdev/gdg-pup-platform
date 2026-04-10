import { Router } from "express";
import { GdgMembersHttpController } from "./gdgmembers.controller";

export class GdgMembersRouter {
  router: Router;

  constructor(private readonly controller: GdgMembersHttpController) {
    this.router = Router();

    this.router.get("/", this.controller.get);
    this.router.post("/", this.controller.post);
    this.router.get("/:gdgId", this.controller.getIdGet);
    this.router.patch("/:gdgId", this.controller.getIdPatch);
    this.router.delete("/:gdgId", this.controller.getIdDelete);
    this.router.post(
      "/:gdgId/make-private",
      this.controller.getIdMakePrivatePost,
    );
    this.router.post(
      "/:gdgId/make-public",
      this.controller.getIdMakePublicPost,
    );
    this.router.post(
      "/:gdgId/profile-image",
      this.controller.changeProfileImage,
    );

    this.router.get("/:gdgId/roles", this.controller.listRolesOfUser);
    this.router.post("/:gdgId/roles", this.controller.addRoleToUser);
    this.router.delete(
      "/:gdgId/roles/:roleName",
      this.controller.deleteRoleFromUser,
    );

    this.router.get("/:gdgId/nfc-card", this.controller.getNfcCardOfUser);
    this.router.post(
      "/:gdgId/nfc-card/activate",
      this.controller.activateNfcCardByGdgId,
    );
  }
}
