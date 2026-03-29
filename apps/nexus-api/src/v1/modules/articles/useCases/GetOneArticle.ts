import { Article } from "../domain/Article";
import { IArticleRepo } from "../domain/IArticleRepo";

 
export class GetOneArticle {
  constructor(private readonly repo: IArticleRepo) {}

  async execute(id: string): Promise<Article> {
    const highlight = await this.repo.findById(id);
    if (!highlight) {
      throw new Error("Highlight not found");
    }

    return highlight;
  }
}
