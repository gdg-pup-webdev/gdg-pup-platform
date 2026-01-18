import { Router } from "express";
import {
  LearningResourceSystemController,
  learningResourceSystemControllerInstance,
} from "./learningResourceSystem.controller.js";
import {
  AuthMiddleware,
  authMiddlewareInstance,
} from "../../middlewares/auth.middleware.js";

export class LearningResourceSystemRouter {
  constructor(
    private readonly resourceSystemController: LearningResourceSystemController = learningResourceSystemControllerInstance,
    private readonly authMiddleware: AuthMiddleware = authMiddlewareInstance,
  ) {}

  getRouter() {
    const router: Router = Router();

    /**
     * @openapi
     * /api/resource-system/resources:
     *   get:
     *     tags:
     *       - Resource System
     *     description: List all resources
     *     responses:
     *       200:
     *         description: Success
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    router.get(
      "/external-resources",
      this.resourceSystemController.listExternalResources,
    );

    /**
     * @openapi
     * /api/resource-system/resources:
     *   post:
     *     tags:
     *       - Resource System
     *     security:
     *       - bearerAuth: []
     *     description: Create a new resource
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/ResourceRequestBody'
     *     responses:
     *       200:
     *         description: Created
     *       401:
     *         $ref: '#/components/responses/UnauthorizedError'
     *       403:
     *         $ref: '#/components/responses/ForbiddenError'
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    router.post(
      "/external-resources",
      this.authMiddleware.requireAuth(),
      this.resourceSystemController.createExternalResource,
    );

    /**
     * @openapi
     * /api/resource-system/resources/{resourceId}:
     *   delete:
     *     tags:
     *       - Resource System
     *     security:
     *       - bearerAuth: []
     *     description: Delete a resource
     *     parameters:
     *       - in: path
     *         name: resourceId
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
      "/external-resources/:externalResourceId",
      this.authMiddleware.requireAuth(),
      this.resourceSystemController.deleteExternalResource,
    );

    /**
     * @openapi
     * /api/resource-system/resources/{resourceId}:
     *   patch:
     *     tags:
     *       - Resource System
     *     security:
     *       - bearerAuth: []
     *     description: Update a resource
     *     parameters:
     *       - in: path
     *         name: resourceId
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/ResourceRequestBody'
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
      "/external-resources/:externalResourceId",
      this.authMiddleware.requireAuth(),
      this.resourceSystemController.updateExternalResource,
    );

    /**
     * @openapi
     * /api/resource-system/resources/{resourceId}:
     *   get:
     *     tags:
     *       - Resource System
     *     description: Get a specific resource by ID
     *     parameters:
     *       - in: path
     *         name: resourceId
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Success
     *       404:
     *         $ref: '#/components/responses/NotFoundError'
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    router.get(
      "/external-resources/:externalResourceId",
      this.resourceSystemController.getOneExternalResource,
    );

    /**
     * @openapi
     * /api/resource-system/resources/{resourceId}/tags:
     *   get:
     *     tags:
     *       - Resource System
     *     description: Get tags for a specific resource (Not yet implemented)
     *     parameters:
     *       - in: path
     *         name: resourceId
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Success
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    router.get("/external-resources/:externalResourceId/tags", (req, res) => {});

    return router;
  }
}

export const learningResourceSystemRouterInstance = new LearningResourceSystemRouter();
