import { Article } from "./Article";
import { ArticleComment } from "./ArticleComment";
 
export interface IArticleCommentRepository {
  findById(id: string): Promise<ArticleComment | null>;
  findAllByArticleId(articleId: string): Promise<{ list: ArticleComment[]; count: number }>;
  saveNew(comment: ArticleComment): Promise<ArticleComment>;
  delete(id: string): Promise<void>;
}