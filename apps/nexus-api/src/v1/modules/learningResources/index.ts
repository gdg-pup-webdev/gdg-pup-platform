import { SupabaseLearningResourceRepository } from "./infrastructure/SupabaseLearningResourceRepository";
import { LearningResourceStorageAdapter } from "./infrastructure/LearningResourceStorageAdapter";
import { TeamModuleAdapter } from "./infrastructure/TeamModuleAdapter";
import { EventModuleAdapter } from "./infrastructure/EventModuleAdapter";
import { CreateLearningResource } from "./useCases/CreateLearningResource";
import { DeleteLearningResource } from "./useCases/DeleteLearningResource";
import { GetLearningResource } from "./useCases/GetLearningResource";
import { ListLearningResources } from "./useCases/ListLearningResources";
import { UpdateLearningResource } from "./useCases/UpdateLearningResource";
import { LearningResourceController } from "./LearningResourceController";
import { teamModuleController } from "../teamsSystem";
import { filesModuleController } from "../filesModule";
import { eventSystemController } from "../eventSystem";

// Infrastructure
const repository = new SupabaseLearningResourceRepository();
const storageAdapter = new LearningResourceStorageAdapter(filesModuleController);
const teamModuleAdapter = new TeamModuleAdapter(teamModuleController);
const eventModuleAdapter = new EventModuleAdapter(eventSystemController);

// Use Cases
export const createLearningResource = new CreateLearningResource(repository, storageAdapter, teamModuleAdapter, eventModuleAdapter);
export const getLearningResource = new GetLearningResource(repository);
export const listLearningResources = new ListLearningResources(repository);
export const updateLearningResource = new UpdateLearningResource(repository, storageAdapter, teamModuleAdapter, eventModuleAdapter);
export const deleteLearningResource = new DeleteLearningResource(repository, storageAdapter);

// Controller
export const learningResourceController = new LearningResourceController(
  createLearningResource,
  getLearningResource,
  listLearningResources,
  updateLearningResource,
  deleteLearningResource
);

// Exports
export { CreateLearningResource, DeleteLearningResource, GetLearningResource, ListLearningResources, UpdateLearningResource };
export { LearningResourceController };
export { SupabaseLearningResourceRepository, LearningResourceStorageAdapter };
