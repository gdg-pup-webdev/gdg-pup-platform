import { BevyEvent } from "./BevyEvent";

export interface IBevyScraperService {
  scrapeAll(): Promise<BevyEvent[]>;
}
