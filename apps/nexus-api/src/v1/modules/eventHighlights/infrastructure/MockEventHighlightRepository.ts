import { IEventHighlightRepository } from "../domain/IEventHighlightRepository";
import { EventHighlight } from "../domain/EventHighlight";

export class MockEventHighlightRepository implements IEventHighlightRepository {
  public items: EventHighlight[] = [];

  async saveNew(highlight: EventHighlight): Promise<EventHighlight> {
    this.items.push(highlight);
    return highlight;
  }

  async persistUpdates(highlight: EventHighlight): Promise<EventHighlight> {
    const index = this.items.findIndex((item) => item.props.id === highlight.props.id);
    if (index !== -1) {
      this.items[index] = highlight;
    }
    return highlight;
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((item) => item.props.id !== id);
  }

  async findById(id: string): Promise<EventHighlight | undefined> {
    return this.items.find((item) => item.props.id === id);
  }

  async list(
    pageNumber: number,
    pageSize: number,
  ): Promise<{ list: EventHighlight[]; count: number }> {
    const start = (pageNumber - 1) * pageSize;
    const end = start + pageSize;
    return {
      list: this.items.slice(start, end),
      count: this.items.length,
    };
  }
}
