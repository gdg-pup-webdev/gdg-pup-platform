import { Router } from "express";
import { CardController, cardControllerInstance } from "./card.controller.js";
import { CardRouter, cardRouterInstance } from "./card.route.js";

export class ClassSystemRouter { 
    constructor (
        private cardRouter: CardRouter = cardRouterInstance
    ) {}

    getRouter() {
        const router : Router = Router();

        router.use("/cards", this.cardRouter.getRouter());

        return router;
    }
}

export const cardSystemRouterInstance = new ClassSystemRouter();