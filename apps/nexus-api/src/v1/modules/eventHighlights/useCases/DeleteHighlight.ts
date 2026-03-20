import { IEventHighlightRepository } from "../domain/IEventHighlightRepository";

export class DeleteHighlight {
  constructor(private readonly repo: IEventHighlightRepository) {}

  async execute(id: string): Promise<void> {
    const highlight = await this.repo.findById(id);
    if (!highlight) {
      throw new Error("Highlight not found");
    }

    await this.repo.delete(id);
  }
}
