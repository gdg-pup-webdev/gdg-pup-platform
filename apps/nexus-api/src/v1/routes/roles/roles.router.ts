import { Router } from "express";
import { RolesHttpController } from "./roles.controller";
import { requirePermissions } from "@/v1/middlewares/rbac.middleware";

export class RolesRouter {
  router: Router;

  constructor(private rolesHttpController: RolesHttpController) { 
    this.router = Router();

    /**
     * PUBLIC ROUTES 
     */

    /**
     * PRIVATE ROUTES 
     */
    this.router.use(requirePermissions({
      "roles": ["queries", "mutations"],
    }))
    

    this.router.get("/", this.rolesHttpController.listRoles);
    this.router.get("/:roleId", this.rolesHttpController.getOne);
    this.router.post("/", this.rolesHttpController.createRole);
 
    this.router.delete("/:roleId", this.rolesHttpController.deleteRole);
    this.router.patch("/:roleId", this.rolesHttpController.updateRole);
 
    this.router.post(
      "/:roleId/permissions",
      this.rolesHttpController.addPermission,
    );
    this.router.patch(
      "/:roleId/permissions",
      this.rolesHttpController.deletePermission,
    );
    
  }
}
