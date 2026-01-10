import { Router } from "express";

export class ResourceSystemRouter {
  constructor() {}

  getRouter() {
    const router = Router();

    router.get("/resources", (req, res) => {});
    router.post("/resources", (req, res) => {});
    router.delete("/resources/:resourceId", (req, res) => {});
    router.put("/resources/:resourceId", (req, res) => {});

    router.get("/resources/:resourceId/tags", (req, res) => {});

    return router;
  }
}

export const resourceSystemRouterInstance = new ResourceSystemRouter();