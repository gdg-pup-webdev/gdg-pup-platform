import { Article } from "./Article";
import { ArticleComment } from "./ArticleComment";

export interface IArticleRepository {
  findById(id: string): Promise<Article | null>;
  findAll(pageNumber: number, pageSize: number): Promise<{ list: Article[]; count: number }>;
  saveNew(article: Article): Promise<Article>;
  persistUpdates(article: Article): Promise<Article>;
  delete(id: string): Promise<void>;
}