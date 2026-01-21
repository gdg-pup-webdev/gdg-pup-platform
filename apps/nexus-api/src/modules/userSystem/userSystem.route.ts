import { Router } from "express";
import {
  UserSystemController,
  userSystemControllerInstance,
} from "./userSystem.controller.js";

export class UserSystemRouter {
  constructor(
    private userSystemController: UserSystemController = userSystemControllerInstance
  ) {}

  getRouter() {
    const router: Router = Router();

    /**
     * @openapi
     * /api/user-system/users/{userId}:
     *   get:
     *     tags:
     *       - User System
     *     description: Get a user by ID
     *     parameters:
     *       - in: path
     *         name: userId
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
    router.get("/users/:userId", this.userSystemController.getUserById);

    /**
     * @openapi
     * /api/user-system/users/{userId}/wallet:
     *   get:
     *     tags:
     *       - User System
     *     description: Get user wallet
     *     parameters:
     *       - in: path
     *         name: userId
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
      "/users/:userId/wallet",
      this.userSystemController.getUserWallet
    );

    /**
     * @openapi
     * /api/user-system/users/{userId}/wallet/transactions:
     *   get:
     *     tags:
     *       - User System
     *     description: List user wallet transactions
     *     parameters:
     *       - in: path
     *         name: userId
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
      "/users/:userId/wallet/transactions",
      this.userSystemController.listUserWalletTransactions
    );

    /**
     * @openapi
     * /api/user-system/users/{userId}/roles:
     *   get:
     *     tags:
     *       - User System
     *     description: List user roles
     *     parameters:
     *       - in: path
     *         name: userId
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
    router.get("/users/:userId/roles", this.userSystemController.listUserRoles);

    /**
     * @openapi
     * /api/user-system/users/{userId}/profile:
     *   get:
     *     tags:
     *       - User System
     *     description: Get user profile
     *     parameters:
     *       - in: path
     *         name: userId
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
      "/users/:userId/profile",
      this.userSystemController.getUserProfile
    );

    /**
     * @openapi
     * /api/user-system/users/{userId}/projects:
     *   get:
     *     tags:
     *       - User System
     *     description: List user projects
     *     parameters:
     *       - in: path
     *         name: userId
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
      "/users/:userId/projects",
      this.userSystemController.listUserProjects
    );

    return router;
  }
}

export const userSystemRouterInstance = new UserSystemRouter();
