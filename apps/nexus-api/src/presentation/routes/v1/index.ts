import { Router, Express } from "express";

export class ApiVersion1Router {
  router: Router;

  constructor() {
    this.router = Router();

    this.router.get("/", (req, res) => {
      res.status(200).json({ message: "this is root of nexus api, version 1" });
    });
  }
}
