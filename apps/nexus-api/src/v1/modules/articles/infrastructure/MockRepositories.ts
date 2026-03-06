import { IArticleRepository } from "../domain/IArticleRepository";
import { IArticleCommentRepository } from "../domain/IArticleCommentRepository";
import { Article } from "../domain/Article";
import { ArticleComment } from "../domain/ArticleComment";

export class MockArticleRepository implements IArticleRepository {
  public articles: Article[] = [];

  async findById(id: string): Promise<Article | null> {
    return this.articles.find(a => a.props.id === id) || null;
  }

  async findAll(pageNumber: number, pageSize: number): Promise<{ list: Article[]; count: number }> {
    const from = (pageNumber - 1) * pageSize;
    const paginated = this.articles.slice(from, from + pageSize);
    return { list: paginated, count: this.articles.length };
  }

  async saveNew(article: Article): Promise<Article> {
    this.articles.push(article);
    return article;
  }

  async persistUpdates(article: Article): Promise<Article> {
    const idx = this.articles.findIndex(a => a.props.id === article.props.id);
    if (idx !== -1) this.articles[idx] = article;
    return article;
  }

  async delete(id: string): Promise<void> {
    this.articles = this.articles.filter(a => a.props.id !== id);
  }
}

export class MockArticleCommentRepository implements IArticleCommentRepository {
  public comments: ArticleComment[] = [];

  async findById(id: string): Promise<ArticleComment | null> {
    return this.comments.find(c => c.props.id === id) || null;
  }

  async findAllByArticleId(articleId: string): Promise<{ list: ArticleComment[]; count: number }> {
    const filtered = this.comments.filter(c => c.props.articleId === articleId);
    return { list: filtered, count: filtered.length };
  }

  async saveNew(comment: ArticleComment): Promise<ArticleComment> {
    this.comments.push(comment);
    return comment;
  }

  async delete(id: string): Promise<void> {
    this.comments = this.comments.filter(c => c.props.id !== id);
  }
}