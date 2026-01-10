import { Router } from "express";


export class EventSystemRouter {
    constructor() {}

    getRouter() {
        const router = Router();

        router.get("/events", (req, res) => {});
        router.post("/events", (req, res) => {});
        router.delete("/events/:eventId", (req, res) => {});
        router.put("/events/:eventId", (req, res) => {});
        router.get("/events/:eventId/attendees", (req, res) => {});

        return router;
    }
}

export const eventSystemRouterInstance = new EventSystemRouter() 