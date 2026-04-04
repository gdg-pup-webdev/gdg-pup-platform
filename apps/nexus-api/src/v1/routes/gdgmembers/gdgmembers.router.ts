import { Router } from "express";
import { GdgMembersHttpController } from "./gdgmembers.controller";
import { requireAuthenticated } from "@/v1/middlewares/auth.middleware";
import { requirePermissions } from "@/v1/middlewares/rbac.middleware";

export class GdgMembersRouter {
  router: Router;

  constructor(private readonly controller: GdgMembersHttpController) {
    this.router = Router();

    /**
     * PUBLIC ROUTES 
     */

    /**
     * AUTHENTICATED ROUTES 
     */
    this.router.use(requireAuthenticated());

    this.router.get("/", this.controller.get);
    this.router.get("/:gdgId", this.controller.getIdGet);
    
    this.router.post("/", this.controller.post);
    this.router.patch("/:gdgId", this.controller.getIdPatch);
    this.router.delete("/:gdgId", this.controller.getIdDelete);
    this.router.post("/:gdgId/make-private", this.controller.getIdMakePrivatePost);
    this.router.post("/:gdgId/make-public", this.controller.getIdMakePublicPost); 
    this.router.post("/:gdgId/profile-image", this.controller.changeProfileImage);


    /**
     * PRIVATE ROUTES 
     */
    this.router.use(requirePermissions({
      "gdg-members": ["mutations", "queries"],
      "rbac": ["queries", "mutations"],
    }))

    this.router.get("/:gdgId/roles", this.controller.listRolesOfUser);
    this.router.post("/:gdgId/roles", this.controller.addRoleToUser);
    this.router.delete("/:gdgId/roles/:roleName", this.controller.deleteRoleFromUser);

  }
}
