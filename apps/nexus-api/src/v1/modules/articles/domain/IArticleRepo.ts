import { Article } from "./Article";

 

export abstract class IArticleRepo {
  abstract saveNew(article: Article): Promise<Article>;
  abstract persistUpdates(article: Article): Promise<Article>;
  abstract delete(gdgId: string): Promise<void>;
  abstract findById(gdgId: string): Promise<Article | undefined>;
  abstract list(
    pageNumber: number,
    pageSize: number,
    eventId?: string,
  ): Promise<{ list: Article[]; count: number }>;
}
