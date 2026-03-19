import { CreateHighlight } from "./useCases/CreateHighlight";
import { UpdateHighlight } from "./useCases/UpdateHighlight";
import { DeleteHighlight } from "./useCases/DeleteHighlight";
import { GetOneHighlight } from "./useCases/GetOneHighlight";
import { ListHighlights } from "./useCases/ListHighlights";
import { EventHighlightRepository } from "./infrastructure/EventHighlightRepository";
import { UserServiceAdapter } from "./infrastructure/UserServiceAdapter";
import { EventServiceAdapter } from "./infrastructure/EventServiceAdapter";
import { EventHighlightsController } from "./EventHighlightsController";

// External dependencies (Will be injected or used from other modules)
import { userModuleController } from "../UserModule";
import { eventSystemController } from "../eventSystem";

/**
 * Note: In this architecture, we should use the controllers of other modules
 * for inter-module communication to keep things decoupled.
 */

const eventHighlightRepository = new EventHighlightRepository();
const userServiceAdapter = new UserServiceAdapter(userModuleController);
const eventServiceAdapter = new EventServiceAdapter(eventSystemController);

// Initialize Use Cases
const createHighlightUseCase = new CreateHighlight(
  eventHighlightRepository,
  userServiceAdapter,
  eventServiceAdapter,
);
const updateHighlightUseCase = new UpdateHighlight(eventHighlightRepository);
const deleteHighlightUseCase = new DeleteHighlight(eventHighlightRepository);
const getOneHighlightUseCase = new GetOneHighlight(eventHighlightRepository);
const listHighlightsUseCase = new ListHighlights(eventHighlightRepository);

// Initialize Controller
export const eventHighlightsController = new EventHighlightsController(
  createHighlightUseCase,
  updateHighlightUseCase,
  deleteHighlightUseCase,
  getOneHighlightUseCase,
  listHighlightsUseCase,
);
