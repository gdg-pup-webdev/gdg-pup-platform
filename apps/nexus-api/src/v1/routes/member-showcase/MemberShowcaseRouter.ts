import { Router } from "express";
import { MemberShowcaseHttpController } from "./MemberShowcase";
import { requirePermissions } from "@/v1/middlewares/rbac.middleware";


export class MemberShowcaseRouter {
  router: Router;

  constructor(private readonly controller: MemberShowcaseHttpController) {
    this.router = Router();

    /**
     * PUBLIC ROUTES 
     */
    this.router.get("/", this.controller.getList);
    this.router.get("/spotlight", this.controller.getSpotlight);
    this.router.get("/:id", this.controller.getOne);

    /**
     * PRIVATE ROUTES 
     */
    this.router.use(requirePermissions({
      "member_showcase": ["mutations"],
    }))
    this.router.post("/", this.controller.postCreate);
    this.router.patch("/:id", this.controller.patchUpdate);
    this.router.delete("/:id", this.controller.deleteDelete);
  }
}
