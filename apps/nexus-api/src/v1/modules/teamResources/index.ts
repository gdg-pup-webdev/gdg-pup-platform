import { MockTeamResourceRepository } from "./infrastructure/MockTeamResourceRepository";
import { MockFileStorage } from "../../utils/MockFileStorage";
import { TeamResourceStorageAdapter } from "./infrastructure/TeamResourceStorageAdapter";
import { CreateTeamResource } from "./useCases/CreateTeamResource";
import { DeleteTeamResource } from "./useCases/DeleteTeamResource";
import { GetTeamResource } from "./useCases/GetTeamResource";
import { ListTeamResources } from "./useCases/ListTeamResources";
import { UpdateTeamResource } from "./useCases/UpdateTeamResource";
import { TeamResourceController } from "./TeamResourceController";

// Using Mock for initial setup
const repository = new MockTeamResourceRepository();
const storageAdapter = new TeamResourceStorageAdapter();

// Use Cases
export const createTeamResource = new CreateTeamResource(repository, storageAdapter);
export const getTeamResource = new GetTeamResource(repository);
export const listTeamResources = new ListTeamResources(repository);
export const updateTeamResource = new UpdateTeamResource(repository, storageAdapter);
export const deleteTeamResource = new DeleteTeamResource(repository, storageAdapter);

// Controller
export const teamResourceController = new TeamResourceController(
  createTeamResource,
  getTeamResource,
  listTeamResources,
  updateTeamResource,
  deleteTeamResource
);

// Exports
export { CreateTeamResource, DeleteTeamResource, GetTeamResource, ListTeamResources, UpdateTeamResource };
export { TeamResourceController };
export { MockTeamResourceRepository, MockFileStorage, TeamResourceStorageAdapter };
