import { EventHighlightUpdateProps, EventHighlight } from "../domain/EventHighlight";
import { IEventHighlightRepository } from "../domain/IEventHighlightRepository";

export class UpdateHighlight {
  constructor(private readonly repo: IEventHighlightRepository) {}

  async execute(id: string, props: EventHighlightUpdateProps): Promise<EventHighlight> {
    const highlight = await this.repo.findById(id);
    if (!highlight) {
      throw new Error("Highlight not found");
    }

    highlight.update(props);
    return await this.repo.persistUpdates(highlight);
  }
}
