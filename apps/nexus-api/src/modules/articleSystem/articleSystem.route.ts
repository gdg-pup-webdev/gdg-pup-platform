import { Router } from "express";

export class ArticleSystemRouter {
  constructor() {}

  getRouter() {
    const router : Router = Router();

    /**
     * @openapi
     * /api/article-system/articles:
     *   get:
     *     tags:
     *       - Articles (Being Built)
     *     description: Get all articles
     *     responses:
     *       200:
     *         description: Success
     */
    router.get("/articles", (req, res) => {});

    /**
     * @openapi
     * /api/article-system/articles:
     *   post:
     *     tags:
     *       - Articles (Being Built)
     *     security:
     *       - bearerAuth: []
     *     description: Create a new article
     *     responses:
     *       201:
     *         description: Created
     */
    router.post("/articles", (req, res) => {});

    /**
     * @openapi
     * /api/article-system/articles/{articleId}:
     *   delete:
     *     tags:
     *       - Articles (Being Built)
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
     */
    router.delete("/articles/:articleId", (req, res) => {});

    /**
     * @openapi
     * /api/article-system/articles/{articleId}:
     *   put:
     *     tags:
     *       - Articles (Being Built)
     *     security:
     *       - bearerAuth: []
     *     description: Update an article
     *     parameters:
     *       - in: path
     *         name: articleId
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Success
     */
    router.put("/articles/:articleId", (req, res) => {});

    /**
     * @openapi
     * /api/article-system/articles/{articleId}/comments:
     *   get:
     *     tags:
     *       - Articles (Being Built)
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
     */
    router.get("/articles/:articleId/comments", (req, res) => {});

    /**
     * @openapi
     * /api/article-system/articles/{articleId}/comments:
     *   post:
     *     tags:
     *       - Articles (Being Built)
     *     security:
     *       - bearerAuth: []
     *     description: Add a comment to an article
     *     parameters:
     *       - in: path
     *         name: articleId
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       201:
     *         description: Created
     */
    router.post("/articles/:articleId/comments", (req, res) => {});

    /**
     * @openapi
     * /api/article-system/articles/{articleId}/comments/{commentId}:
     *   delete:
     *     tags:
     *       - Articles (Being Built)
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
     */
    router.delete("/articles/:articleId/comments/:commentId", (req, res) => {});

    return router;
  }
}

export const articleRouterInstance = new ArticleSystemRouter();
