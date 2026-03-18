import { SupabaseTeamResourceRepository } from "./infrastructure/SupabaseTeamResourceRepository";
import { TeamResourceStorageAdapter } from "./infrastructure/TeamResourceStorageAdapter";
import { TeamResourceTeamServiceAdapter } from "./infrastructure/TeamResourceTeamServiceAdapter";
import { CreateTeamResource } from "./useCases/CreateTeamResource";
import { DeleteTeamResource } from "./useCases/DeleteTeamResource";
import { GetTeamResource } from "./useCases/GetTeamResource";
import { ListTeamResources } from "./useCases/ListTeamResources";
import { UpdateTeamResource } from "./useCases/UpdateTeamResource";
import { TeamResourceController } from "./TeamResourceController";
import { teamModuleController } from "../teamsSystem";
import { filesModuleController } from "../filesModule";

// Infrastructure
const repository = new SupabaseTeamResourceRepository();
const storageAdapter = new TeamResourceStorageAdapter(filesModuleController);
const teamServiceAdapter = new TeamResourceTeamServiceAdapter(teamModuleController);

// Use Cases
export const createTeamResource = new CreateTeamResource(repository, storageAdapter, teamServiceAdapter);
export const getTeamResource = new GetTeamResource(repository);
export const listTeamResources = new ListTeamResources(repository);
export const updateTeamResource = new UpdateTeamResource(repository, storageAdapter, teamServiceAdapter);
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
export { SupabaseTeamResourceRepository, TeamResourceStorageAdapter };
