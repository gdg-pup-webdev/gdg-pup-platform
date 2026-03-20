import { TeamResourceFilters } from "./domain/ITeamResourceRepository";
import { TeamResource } from "./domain/TeamResource";
import { CreateTeamResource, CreateTeamResourceInput } from "./useCases/CreateTeamResource";
import { DeleteTeamResource } from "./useCases/DeleteTeamResource";
import { GetTeamResource } from "./useCases/GetTeamResource";
import { ListTeamResources } from "./useCases/ListTeamResources";
import { UpdateTeamResource, UpdateTeamResourceInput } from "./useCases/UpdateTeamResource";

export interface TeamResourceDTO {
  id: string;
  title: string;
  description: string;
  resourceLink: string;
  resourceType: string;
  thumbnailPublicUrl: string;
  teamName: string;
  createdAt: string;
  updatedAt: string;
}

export class TeamResourceController {
  constructor(
    private readonly createUseCase: CreateTeamResource,
    private readonly getUseCase: GetTeamResource,
    private readonly listUseCase: ListTeamResources,
    private readonly updateUseCase: UpdateTeamResource,
    private readonly deleteUseCase: DeleteTeamResource
  ) {}

  private toDTO(resource: TeamResource): TeamResourceDTO {
    const p = resource.props;
    return {
      id: p.id,
      title: p.title,
      description: p.description,
      resourceLink: p.resourceLink,
      resourceType: p.resourceType,
      thumbnailPublicUrl: p.thumbnailPublicUrl,
      teamName: p.teamName,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    };
  }

  async create(input: CreateTeamResourceInput) {
    const resource = await this.createUseCase.execute(input);
    return this.toDTO(resource);
  }

  async getResource(id: string) {
    const resource = await this.getUseCase.execute(id);
    return this.toDTO(resource);
  }

  async listResources(pageNumber: number, pageSize: number, filters: TeamResourceFilters) {
    const { list, count } = await this.listUseCase.execute(pageNumber, pageSize, filters);
    return {
      list: list.map(r => this.toDTO(r)),
      count,
    };
  }

  async updateResource(id: string, updates: UpdateTeamResourceInput) {
    const resource = await this.updateUseCase.execute(id, updates);
    return this.toDTO(resource);
  }

  async deleteResource(id: string) {
    await this.deleteUseCase.execute(id);
    return true;
  }
}
