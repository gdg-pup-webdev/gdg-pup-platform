import { Article } from "../domain/Article";
import { IArticleRepo } from "../domain/IArticleRepo";

 
export class ListArticles {
  constructor(private readonly repo: IArticleRepo) {}

  async execute(
    pageNumber: number,
    pageSize: number,
    eventId?: string,
  ): Promise<{ list: Article[]; count: number }> {
    return await this.repo.list(pageNumber, pageSize, eventId);
  }
}
