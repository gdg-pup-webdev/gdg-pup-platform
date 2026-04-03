import { LearningResourceFilters } from "./domain/ILearningResourceRepository";
import { LearningResource, LearningResourceTeamSummary, LearningResourceEventSummary } from "./domain/LearningResource";
import { CreateLearningResource, CreateLearningResourceInput } from "./useCases/CreateLearningResource";
import { DeleteLearningResource } from "./useCases/DeleteLearningResource";
import { GetLearningResource } from "./useCases/GetLearningResource";
import { ListLearningResources } from "./useCases/ListLearningResources";
import { UpdateLearningResource, UpdateLearningResourceInput } from "./useCases/UpdateLearningResource";
import { SearchLearningResources } from "./useCases/SearchLearningResources";
import { ListLearningResourcesByTag } from "./useCases/ListLearningResourcesByTag";

export interface LearningResourceDTO {
  id: string;
  title: string;
  description: string;
  url: string;
  tags: string[];
  teamId: string | null;
  eventId: string | null;
  thumbnailUrl: string | null;
  createdAt: string;
  updatedAt: string;
  team?: LearningResourceTeamSummary | null;
  event?: {
    id: string;
    title: string;
    description: string | null;
    imageUrl: string | null;
    startDate: string | null;
    endDate: string | null;
    venue: string | null;
  } | null;
}

export class LearningResourceController {
  constructor(
    private readonly createUseCase: CreateLearningResource,
    private readonly getUseCase: GetLearningResource,
    private readonly listUseCase: ListLearningResources,
    private readonly updateUseCase: UpdateLearningResource,
    private readonly deleteUseCase: DeleteLearningResource,
    private readonly searchUseCase: SearchLearningResources,
    private readonly listByTagUseCase: ListLearningResourcesByTag
  ) {}

  private toDTO(resource: LearningResource): LearningResourceDTO {
    const p = resource.props;
    return {
      id: p.id,
      title: p.title,
      description: p.description,
      url: p.url,
      tags: p.tags,
      teamId: p.teamId,
      eventId: p.eventId,
      thumbnailUrl: p.thumbnailUrl,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      team: p.team || null,
      event: p.event ? {
        ...p.event,
        startDate: p.event.startDate ? p.event.startDate.toISOString() : null,
        endDate: p.event.endDate ? p.event.endDate.toISOString() : null,
      } : null,
    };
  }

  async create(input: CreateLearningResourceInput) {
    const resource = await this.createUseCase.execute(input);
    return this.toDTO(resource);
  }

  async getResource(id: string) {
    const resource = await this.getUseCase.execute(id);
    if (!resource) return null;
    return this.toDTO(resource);
  }

  async listResources(pageNumber: number, pageSize: number, filters: LearningResourceFilters) {
    const { list, count } = await this.listUseCase.execute(pageNumber, pageSize, filters);
    return {
      list: list.map(r => this.toDTO(r)),
      count,
    };
  }

  async listResourcesByTag(tag: string, pageNumber: number, pageSize: number) {
    const { list, count } = await this.listByTagUseCase.execute(tag, pageNumber, pageSize);
    return {
      list: list.map(r => this.toDTO(r)),
      count,
    };
  }

  async searchResources(query: string, limit: number = 10) {
    const list = await this.searchUseCase.execute(query, limit);
    return list.map(r => this.toDTO(r));
  }

  async updateResource(id: string, updates: UpdateLearningResourceInput) {
    const resource = await this.updateUseCase.execute(id, updates);
    return this.toDTO(resource);
  }

  async deleteResource(id: string) {
    await this.deleteUseCase.execute(id);
    return true;
  }
}
