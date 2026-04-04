import { Router } from "express";
import { MemberProjectsHttpController } from "./MemberProjects";
import { requirePermissions } from "@/v1/middlewares/rbac.middleware";
import { requireAuthenticated } from "@/v1/middlewares/auth.middleware";

export class MemberProjectsRouter {
  router: Router;

  constructor(private readonly controller: MemberProjectsHttpController) {
    this.router = Router();

    /**
     * PUBLIC ROUTES
     */
    this.router.get("/:id", this.controller.getOne);
    this.router.get("/", this.controller.getList);

    /**
     * AUTHENTICATED ROUTES
     */
    this.router.use(requireAuthenticated());
    this.router.post("/", this.controller.postCreate);
    this.router.get("/search", this.controller.getSearch);
    this.router.get("/random", this.controller.getRandom);

    /**
     * PRIVATE ROUTES
     */
    this.router.use(
      requirePermissions({
        member_projects: ["mutations"],
      }),
    );

    this.router.patch("/:id", this.controller.patchUpdate);
    this.router.delete("/:id", this.controller.deleteDelete);
    // this.router.get("/member/:memberGdgId", this.controller.getByMember);
  }
}
