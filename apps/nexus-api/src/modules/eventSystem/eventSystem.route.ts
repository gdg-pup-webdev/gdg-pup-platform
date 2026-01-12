import { Router } from "express";
import {
  EventSystemController,
  eventSystemControllerInstance,
} from "./eventSystem.controller.js";
import {
  AuthMiddleware,
  authMiddlewareInstance,
} from "../../middlewares/auth.middleware.js";

export class EventSystemRouter {
  constructor(
    private eventSystemController: EventSystemController = eventSystemControllerInstance,
    private authMiddleware: AuthMiddleware = authMiddlewareInstance
  ) {}

  getRouter() {
    const router = Router();

    /**
     * @openapi
     * /api/event-system/events:
     *   get:
     *     tags:
     *       - Event System
     *     description: List all events
     *     responses:
     *       200:
     *         description: Success
     *       500:
     *         $ref: '#/components/responses/InternalServerError' 
     */
    router.get("/events", this.eventSystemController.list);

    /**
     * @openapi
     * /api/event-system/events:
     *   post:
     *     tags:
     *       - Event System
     *     security:
     *       - bearerAuth: []
     *     description: Create a new event
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/EventRequestBody'
     *     responses:
     *       201:
     *         description: Created
     *       401:
     *         $ref: '#/components/responses/UnauthorizedError'
     *       403:
     *         $ref: '#/components/responses/ForbiddenError'
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    router.post(
      "/events",
      this.authMiddleware.requireAuth(),
      this.eventSystemController.create
    );

    /**
     * @openapi
     * /api/event-system/events/{eventId}:
     *   get:
     *     tags:
     *       - Event System
     *     security:
     *       - bearerAuth: []
     *     description: Get an event by ID
     *     parameters:
     *       - in: path
     *         name: eventId
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Success
     *       401:
     *         $ref: '#/components/responses/UnauthorizedError'
     *       403:
     *         $ref: '#/components/responses/ForbiddenError'
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    router.get(
      "/events/:eventId",
      this.eventSystemController.getOne
    );

    /**
     * @openapi
     * /api/event-system/events/{eventId}:
     *   delete:
     *     tags:
     *       - Event System
     *     security:
     *       - bearerAuth: []
     *     description: Delete an event
     *     parameters:
     *       - in: path
     *         name: eventId
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Success
     *       401:
     *         $ref: '#/components/responses/UnauthorizedError'
     *       403:
     *         $ref: '#/components/responses/ForbiddenError'
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    router.delete(
      "/events/:eventId",
      this.authMiddleware.requireAuth(),
      this.eventSystemController.delete
    );

    /**
     * @openapi
     * /api/event-system/events/{eventId}:
     *   put:
     *     tags:
     *       - Event System
     *     security:
     *       - bearerAuth: []
     *     description: Update an event
     *     parameters:
     *       - in: path
     *         name: eventId
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/EventRequestBody'
     *     responses:
     *       200:
     *         description: Success
     *       401:
     *         $ref: '#/components/responses/UnauthorizedError'
     *       403:
     *         $ref: '#/components/responses/ForbiddenError'
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    router.put(
      "/events/:eventId",
      this.authMiddleware.requireAuth(),
      this.eventSystemController.update
    );

    /**
     * @openapi
     * /api/event-system/events/{eventId}/attendees:
     *   get:
     *     tags:
     *       - Event System
     *     description: List attendees for an event
     *     parameters:
     *       - in: path
     *         name: eventId
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Success
     */
    router.get(
      "/events/:eventId/attendees",
      this.eventSystemController.listEventAttendees
    );

    /**
     * @openapi
     * /api/event-system/checkin:
     *   post:
     *     tags:
     *       - Event System
     *     security:
     *       - bearerAuth: []
     *     description: Check-in a user to an event
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/AttendeeRequestBody'
     *     responses:
     *       200:
     *         description: Success
     *       401:
     *         $ref: '#/components/responses/UnauthorizedError'
     *       403:
     *         $ref: '#/components/responses/ForbiddenError'
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    router.post(
      "/checkin",
      this.authMiddleware.requireAuth(),
      this.eventSystemController.checkin
    );

    return router;
  }
}

export const eventSystemRouterInstance = new EventSystemRouter();
