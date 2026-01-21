import { Router } from "express";
import {
  AuthMiddleware,
  authMiddlewareInstance,
} from "../../middlewares/auth.middleware.js";
import {
  EventController,
  eventControllerInstance,
} from "./event.controller.js";

export class EventRouter {
  constructor(
    private eventSystemController: EventController = eventControllerInstance,
    private authMiddleware: AuthMiddleware = authMiddlewareInstance,
  ) {}

  getRouter() {
    const router: Router = Router();

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
    router.get("/", this.eventSystemController.listEvents);

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
      "/",
      this.authMiddleware.requireAuth(),
      this.eventSystemController.createEvent,
      // (req, res) => res.status(200).json({ message: "not implemented" })
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
    router.get("/:eventId", this.eventSystemController.getOneEvent);

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
      "/:eventId",
      this.authMiddleware.requireAuth(),
      this.eventSystemController.delete,
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
    router.patch(
      "/:eventId",
      this.authMiddleware.requireAuth(),
      this.eventSystemController.updateEvent,
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
      "/:eventId/attendees",
      this.eventSystemController.listEventAttendees,
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
      this.eventSystemController.checkinToAnEvent,
    );

    return router;
  }
}

export const eventRouterInstance = new EventRouter();
