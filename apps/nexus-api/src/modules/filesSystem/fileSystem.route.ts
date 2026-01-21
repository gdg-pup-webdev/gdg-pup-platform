import { Router } from "express";

export class FileSystemRouter {
  constructor() {}

  getRouter() : Router {
    const router = Router();
    return router;
  } 
}

export const fileSystemRouterInstance = new FileSystemRouter();
