import { MockBevyEventRepository } from "./infrastructure/MockBevyEventRepository";
import { ListBevyEvents } from "./useCases/ListBevyEvents";
import { BevyEventController } from "./BevyEventController";
import { SupabaseBevyEventRepository } from "./infrastructure/SupabaseBevyEventRepository";

// 1. Initialize Infrastructure
// const repository = new MockBevyEventRepository();
const repository = new SupabaseBevyEventRepository();

// 2. Initialize Use Cases
const listBevyEventsUseCase = new ListBevyEvents(repository);

// 3. Initialize Controller
export const bevyEventController = new BevyEventController(
  listBevyEventsUseCase,
);
