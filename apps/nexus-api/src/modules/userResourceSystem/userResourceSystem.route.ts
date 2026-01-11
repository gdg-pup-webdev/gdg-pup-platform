import { Router } from "express";
import {
  UserResourceSystemController,
  userResourceSystemControllerInstance,
} from "./userResourceSystem.controller.js";
import {
  AuthMiddleware,
  authMiddlewareInstance,
} from "../../middlewares/auth.middleware.js";

export class UserResourceSystemRouter {
  constructor(
    private userResourceSystemController: UserResourceSystemController = userResourceSystemControllerInstance,
    private authMiddleware: AuthMiddleware = authMiddlewareInstance
  ) {}

  getRouter() {
    const router = Router();

    /**
     * @openapi
     * /api/user-resource-system/projects:
     *   get:
     *     tags:
     *       - User Resource System
     *     description: List all user projects (Not yet implemented)
     *     responses:
     *       200:
     *         description: Success
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    router.get("/projects", (req, res) => {});

    /**
     * @openapi
     * /api/user-resource-system/projects:
     *   post:
     *     tags:
     *       - User Resource System
     *     security:
     *       - bearerAuth: []
     *     description: Create a new user project
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UserProjectRequestBody'
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
      "/projects",
      this.authMiddleware.requireAuth(),
      this.userResourceSystemController.create
    );

    /**
     * @openapi
     * /api/user-resource-system/projects/{projectId}:
     *   get:
     *     tags:
     *       - User Resource System
     *     description: Get a specific user project by ID
     *     parameters:
     *       - in: path
     *         name: projectId
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
      "/projects/:projectId",
      this.userResourceSystemController.getOne
    );

    /**
     * @openapi
     * /api/user-resource-system/projects/{projectId}:
     *   delete:
     *     tags:
     *       - User Resource System
     *     security:
     *       - bearerAuth: []
     *     description: Delete a user project
     *     parameters:
     *       - in: path
     *         name: projectId
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
     *       404:
     *         $ref: '#/components/responses/NotFoundError'
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    router.delete(
      "/projects/:projectId",
      this.authMiddleware.requireAuth(),
      this.userResourceSystemController.delete
    );

    /**
     * @openapi
     * /api/user-resource-system/projects/{projectId}:
     *   patch:
     *     tags:
     *       - User Resource System
     *     security:
     *       - bearerAuth: []
     *     description: Update a user project
     *     parameters:
     *       - in: path
     *         name: projectId
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UserProjectRequestBody'
     *     responses:
     *       200:
     *         description: Success
     *       401:
     *         $ref: '#/components/responses/UnauthorizedError'
     *       403:
     *         $ref: '#/components/responses/ForbiddenError'
     *       404:
     *         $ref: '#/components/responses/NotFoundError'
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    router.patch(
      "/projects/:projectId",
      this.authMiddleware.requireAuth(),
      this.userResourceSystemController.update
    );

    return router;
  }
}

export const userResourceSystemRouterInstance = new UserResourceSystemRouter();
