import { IBevyEventRepository } from "../domain/IBevyEventRepository";
import { IBevyScraperService } from "../domain/IBevyScraperService";

export class SyncBevyEvents {
  constructor(
    private readonly repo: IBevyEventRepository,
    private readonly scraper: IBevyScraperService
  ) {}

  async execute(): Promise<number> {
    const scrapedEvents = await this.scraper.scrapeAll();
    
    if (scrapedEvents.length > 0) {
      await this.repo.upsertMany(scrapedEvents);
    }
    
    return scrapedEvents.length;
  }
}
