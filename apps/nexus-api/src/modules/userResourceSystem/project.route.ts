import { Router } from "express";
import {
  ProjectController,
  projectControllerInstance,
} from "./project.controller.js";
import {
  AuthMiddleware,
  authMiddlewareInstance,
} from "../../middlewares/auth.middleware.js";

export class ProjectRouter {
  constructor(
    private userResourceSystemController: ProjectController = projectControllerInstance,
    private authMiddleware: AuthMiddleware = authMiddlewareInstance
  ) {}

  getRouter() {
    const router : Router= Router();

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
    router.get("/", (req, res) => {});

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
      "/",
      this.authMiddleware.requireAuth(),
      this.userResourceSystemController.createProject
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
      "/:projectId",
      this.userResourceSystemController.getOneProject
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
      "/:projectId",
      this.authMiddleware.requireAuth(),
      this.userResourceSystemController.deleteProject
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
      "/:projectId",
      this.authMiddleware.requireAuth(),
      this.userResourceSystemController.updateProject
    );

    return router;
  }
}

export const projectRotuerInstance = new ProjectRouter();
