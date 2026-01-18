import { Router } from "express";
import {
  ArticleSystemController,
  articleSystemControllerInstance,
} from "./articleSystem.controller.js";
import {
  AuthMiddleware,
  authMiddlewareInstance,
} from "../../middlewares/auth.middleware.js";

export class ArticleSystemRouter {
  constructor(
    private articleSystemController: ArticleSystemController = articleSystemControllerInstance,
    private authMiddleware: AuthMiddleware = authMiddlewareInstance
  ) {}

  getRouter() {
    const router: Router = Router();

    /**
     * @openapi
     * /api/article-system/articles:
     *   get:
     *     tags:
     *       - Articles
     *     description: Get all articles
     *     responses:
     *       200:
     *         description: Success
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    router.get("/articles", this.articleSystemController.list);

    /**
     * @openapi
     * /api/article-system/articles:
     *   post:
     *     tags:
     *       - Articles
     *     security:
     *       - bearerAuth: []
     *     description: Create a new article
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/ArticleRequestBody' 
     *     responses:
     *       201:
     *         description: Created
     *       401:
     *         $ref: '#/components/responses/UnauthorizedError'
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    router.post(
      "/articles",
      this.authMiddleware.requireAuth(),
      this.articleSystemController.create
    );

    /**
     * @openapi
     * /api/article-system/articles/{articleId}:
     *   delete:
     *     tags:
     *       - Articles
     *     security:
     *       - bearerAuth: []
     *     description: Delete an article
     *     parameters:
     *       - in: path
     *         name: articleId
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Success
     *       401:
     *         $ref: '#/components/responses/UnauthorizedError'
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    router.delete(
      "/articles/:articleId",
      this.authMiddleware.requireAuth(),
      this.articleSystemController.delete
    );

    /**
     * @openapi
     * /api/article-system/articles/{articleId}:
     *   patch:
     *     tags:
     *       - Articles
     *     security:
     *       - bearerAuth: []
     *     description: Update an article
     *     parameters:
     *       - in: path
     *         name: articleId
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/ArticleUpdateRequestBody'
     *     responses:
     *       200:
     *         description: Success
     *       401:
     *         $ref: '#/components/responses/UnauthorizedError'
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    router.patch(
      "/articles/:articleId",
      this.authMiddleware.requireAuth(),
      this.articleSystemController.update
    );

    /**
     * @openapi
     * /api/article-system/articles/{articleId}:
     *   get:
     *     tags:
     *       - Articles
     *     description: Get article by ID
     *     parameters:
     *       - in: path
     *         name: articleId
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Success
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    router.get("/articles/:articleId", this.articleSystemController.getOne);

    /**
     * @openapi
     * /api/article-system/articles/{articleId}/comments:
     *   get:
     *     tags:
     *       - Articles
     *     description: Get comments for an article
     *     parameters:
     *       - in: path
     *         name: articleId
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Success
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    router.get(
      "/articles/:articleId/comments",
      this.articleSystemController.listComments
    );

    /**
     * @openapi
     * /api/article-system/articles/{articleId}/comments:
     *   post:
     *     tags:
     *       - Articles
     *     security:
     *       - bearerAuth: []
     *     description: Add a comment to an article
     *     parameters:
     *       - in: path
     *         name: articleId
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CommentRequestBody'
     *     responses:
     *       201:
     *         description: Created
     *       401:
     *         $ref: '#/components/responses/UnauthorizedError'
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    router.post(
      "/articles/:articleId/comments",
      this.authMiddleware.requireAuth(),
      this.articleSystemController.createComment
    );

    /**
     * @openapi
     * /api/article-system/articles/{articleId}/comments/{commentId}:
     *   delete:
     *     tags:
     *       - Articles
     *     security:
     *       - bearerAuth: []
     *     description: Delete a comment
     *     parameters:
     *       - in: path
     *         name: articleId
     *         required: true
     *         schema:
     *           type: string
     *       - in: path
     *         name: commentId
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Success
     *       401:
     *         $ref: '#/components/responses/UnauthorizedError'
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    router.delete(
      "/articles/:articleId/comments/:commentId",
      this.authMiddleware.requireAuth(),
      this.articleSystemController.deleteComment
    );

    return router;
  }
}

export const articleRouterInstance = new ArticleSystemRouter();
