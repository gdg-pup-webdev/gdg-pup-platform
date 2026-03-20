import { TeamResource } from "./TeamResource";

export interface TeamResourceFilters {
  search?: string;
  teamName?: string;
  resourceType?: string;
}

export interface ITeamResourceRepository {
  findById(id: string): Promise<TeamResource | null>;
  findAll(pageNumber: number, pageSize: number, filters?: TeamResourceFilters): Promise<{ list: TeamResource[]; count: number }>;
  saveNew(teamResource: TeamResource): Promise<TeamResource>;
  persistUpdates(teamResource: TeamResource): Promise<TeamResource>;
  delete(id: string): Promise<void>;
}
