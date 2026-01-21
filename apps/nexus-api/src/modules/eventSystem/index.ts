import { Router } from "express";
import { EventRouter, eventRouterInstance } from "./event.route";

export class EventSystemRouter {
  constructor(private eventRouter: EventRouter = eventRouterInstance) {}

  getRouter = (): Router => {
    const router = Router();

    router.use("/events", this.eventRouter.getRouter());

    return router;
  };
}

export const eventSystemRouterInstance = new EventSystemRouter();
