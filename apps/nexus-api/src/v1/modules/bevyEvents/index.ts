import { ListBevyEvents } from "./useCases/ListBevyEvents";
import { GetBevyEvent } from "./useCases/GetBevyEvent";
import { BevyEventController } from "./BevyEventController";
import { SupabaseBevyEventRepository } from "./infrastructure/SupabaseBevyEventRepository";
import { BevyScraperService } from "./infrastructure/BevyScraperService";
import { SyncBevyEvents } from "./useCases/SyncBevyEvents";

// 1. Initialize Infrastructure
const repository = new SupabaseBevyEventRepository();
const scraperService = new BevyScraperService();

// 2. Initialize Use Cases
const listBevyEventsUseCase = new ListBevyEvents(repository);
const getBevyEventUseCase = new GetBevyEvent(repository);
const syncBevyEventsUseCase = new SyncBevyEvents(repository, scraperService);

// 3. Initialize Controller
export const bevyEventController = new BevyEventController(
  listBevyEventsUseCase,
  getBevyEventUseCase,
  syncBevyEventsUseCase,
);
