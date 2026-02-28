import { IArticleRepository } from "../domain/IArticleRepository";
import { IArticleCommentRepository } from "../domain/IArticleCommentRepository";
import { Article, ArticleInsertProps, ArticleUpdateProps } from "../domain/Article";
import { ArticleComment, ArticleCommentInsertProps } from "../domain/ArticleComment";

export class CreateArticle {
  constructor(private readonly repo: IArticleRepository) {}
  async execute(props: ArticleInsertProps): Promise<Article> {
    const article = Article.create(props);
    return await this.repo.saveNew(article);
  }
}

export class GetOneArticle {
  constructor(private readonly repo: IArticleRepository) {}
  async execute(id: string): Promise<Article> {
    const article = await this.repo.findById(id);
    if (!article) throw new Error(`Article with ID ${id} not found.`);
    return article;
  }
}

export class ListArticles {
  constructor(private readonly repo: IArticleRepository) {}
  async execute(pageNumber: number, pageSize: number): Promise<{ list: Article[]; count: number }> {
    return await this.repo.findAll(pageNumber, pageSize);
  }
}

export class UpdateArticle {
  constructor(private readonly repo: IArticleRepository) {}
  async execute(id: string, props: ArticleUpdateProps): Promise<Article> {
    const article = await this.repo.findById(id);
    if (!article) throw new Error(`Cannot update: Article with ID ${id} not found.`);
    article.update(props);
    return await this.repo.persistUpdates(article);
  }
}

export class DeleteArticle {
  constructor(private readonly repo: IArticleRepository) {}
  async execute(id: string): Promise<boolean> {
    const article = await this.repo.findById(id);
    if (!article) return true; // Idempotent deletion
    await this.repo.delete(id);
    return true;
  }
}

export class CreateArticleComment {
  constructor(private readonly repo: IArticleCommentRepository) {}
  async execute(props: ArticleCommentInsertProps): Promise<ArticleComment> {
    const comment = ArticleComment.create(props);
    return await this.repo.saveNew(comment);
  }
}

export class ListArticleComments {
  constructor(private readonly repo: IArticleCommentRepository) {}
  async execute(articleId: string): Promise<{ list: ArticleComment[]; count: number }> {
    return await this.repo.findAllByArticleId(articleId);
  }
}

export class DeleteArticleComment {
  constructor(private readonly repo: IArticleCommentRepository) {}
  async execute(id: string): Promise<boolean> {
    const comment = await this.repo.findById(id);
    if (!comment) return true;
    await this.repo.delete(id);
    return true;
  }
}