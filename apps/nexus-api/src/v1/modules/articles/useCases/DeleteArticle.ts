import { IArticleRepo } from "../domain/IArticleRepo";

 
export class DeleteArticle {
  constructor(private readonly repo: IArticleRepo) {}

  async execute(id: string): Promise<void> {
    const highlight = await this.repo.findById(id);
    if (!highlight) {
      throw new Error("Highlight not found");
    }

    await this.repo.delete(id);
  }
}
