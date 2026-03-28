import { LearningResourceFilters } from "./domain/ILearningResourceRepository";
import { LearningResource, LearningResourceType } from "./domain/LearningResource";
import { CreateLearningResource, CreateLearningResourceInput } from "./useCases/CreateLearningResource";
import { DeleteLearningResource } from "./useCases/DeleteLearningResource";
import { GetLearningResource } from "./useCases/GetLearningResource";
import { ListLearningResources } from "./useCases/ListLearningResources";
import { UpdateLearningResource, UpdateLearningResourceInput } from "./useCases/UpdateLearningResource";

export interface LearningResourceDTO {
  id: string;
  title: string;
  description: string;
  url: string;
  type: LearningResourceType;
  tags: string[];
  teamId: string | null;
  eventId: string | null;
  thumbnailUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export class LearningResourceController {
  constructor(
    private readonly createUseCase: CreateLearningResource,
    private readonly getUseCase: GetLearningResource,
    private readonly listUseCase: ListLearningResources,
    private readonly updateUseCase: UpdateLearningResource,
    private readonly deleteUseCase: DeleteLearningResource
  ) {}

  private toDTO(resource: LearningResource): LearningResourceDTO {
    const p = resource.props;
    return {
      id: p.id,
      title: p.title,
      description: p.description,
      url: p.url,
      type: p.type,
      tags: p.tags,
      teamId: p.teamId,
      eventId: p.eventId,
      thumbnailUrl: p.thumbnailUrl,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
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

  async updateResource(id: string, updates: UpdateLearningResourceInput) {
    const resource = await this.updateUseCase.execute(id, updates);
    return this.toDTO(resource);
  }

  async deleteResource(id: string) {
    await this.deleteUseCase.execute(id);
    return true;
  }
}
