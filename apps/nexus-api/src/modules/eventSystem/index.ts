import { Router } from "express";
import { EventRouter, eventRouterInstance } from "./event.route";

export class EventSystemRouter {
  constructor(private eventRouter: EventRouter = eventRouterInstance) {}

  getRouter = (): Router => {
    const router = Router();
    return router;
  };
}

export const eventSystemRouterInstance = new EventSystemRouter();
