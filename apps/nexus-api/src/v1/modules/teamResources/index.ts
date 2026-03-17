import { MockTeamResourceRepository } from "./infrastructure/MockTeamResourceRepository";
import { CreateTeamResource } from "./useCases/CreateTeamResource";
import { DeleteTeamResource } from "./useCases/DeleteTeamResource";
import { GetTeamResource } from "./useCases/GetTeamResource";
import { ListTeamResources } from "./useCases/ListTeamResources";
import { UpdateTeamResource } from "./useCases/UpdateTeamResource";
import { TeamResourceController } from "./TeamResourceController";

// Using Mock for initial setup as requested
const repository = new MockTeamResourceRepository();

// Use Cases
export const createTeamResource = new CreateTeamResource(repository);
export const getTeamResource = new GetTeamResource(repository);
export const listTeamResources = new ListTeamResources(repository);
export const updateTeamResource = new UpdateTeamResource(repository);
export const deleteTeamResource = new DeleteTeamResource(repository);

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
export { MockTeamResourceRepository };
