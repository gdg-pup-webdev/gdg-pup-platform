import { CreateArticle, CreateArticleComment, DeleteArticle, DeleteArticleComment, GetOneArticle, ListArticleComments, ListArticles, UpdateArticle } from "./useCases/ArticleUseCases";

 

export class ArticleController {
  constructor(
    private createArticle: CreateArticle,
    private getOneArticle: GetOneArticle,
    private listArticles: ListArticles,
    private updateArticle: UpdateArticle,
    private deleteArticle: DeleteArticle,
    private createArticleComment: CreateArticleComment,
    private listArticleComments: ListArticleComments,
    private deleteArticleComment: DeleteArticleComment
  ) {}

  async create(authorId: string, title: string, content: string) {
    const result = await this.createArticle.execute({ authorId, title, content });
    return result.props;
  }

  async getOne(id: string) {
    const result = await this.getOneArticle.execute(id);
    return result.props;
  }

  async list(pageNumber: number, pageSize: number) {
    const { list, count } = await this.listArticles.execute(pageNumber, pageSize);
    return {
      list: list.map(a => a.props),
      count
    };
  }

  async update(id: string, updates: { title?: string; content?: string }) {
    const result = await this.updateArticle.execute(id, updates);
    return result.props;
  }

  async delete(id: string) {
    return await this.deleteArticle.execute(id);
  }

  async createComment(articleId: string, userId: string, body: string) {
    const result = await this.createArticleComment.execute({ articleId, userId, body });
    return result.props;
  }

  async listComments(articleId: string) {
    const { list, count } = await this.listArticleComments.execute(articleId);
    return {
      list: list.map(c => c.props),
      count
    };
  }

  async deleteComment(id: string) {
    return await this.deleteArticleComment.execute(id);
  }
}