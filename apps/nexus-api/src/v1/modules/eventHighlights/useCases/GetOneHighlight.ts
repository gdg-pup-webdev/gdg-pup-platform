import { EventHighlight } from "../domain/EventHighlight";
import { IEventHighlightRepository } from "../domain/IEventHighlightRepository";

export class GetOneHighlight {
  constructor(private readonly repo: IEventHighlightRepository) {}

  async execute(id: string): Promise<EventHighlight> {
    const highlight = await this.repo.findById(id);
    if (!highlight) {
      throw new Error("Highlight not found");
    }

    return highlight;
  }
}
