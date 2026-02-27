import { LearningResourceFilters } from "./domain/ILearningResourceRepository";
import { LearningResource } from "./domain/LearningResource";
import { CreateLearningResource } from "./useCases/CreateLearningResource";
import { DeleteLearningResource } from "./useCases/DeleteLearningResource";
import { GetOneLearningResource } from "./useCases/GetOneLearningResource";
import { ListLearningResources } from "./useCases/ListLearningResources";
import { UpdateLearningResource } from "./useCases/UpdateLearningResource";

 

export interface LearningResourceDTO {
  id: string;
  uploaderId: string;
  title: string;
  description: string;
  url: string;
  tagIds: string[];
  createdAt: string;
}

export class LearningResourceController {
  constructor(
    private readonly createUseCase: CreateLearningResource,
    private readonly getOneUseCase: GetOneLearningResource,
    private readonly listUseCase: ListLearningResources,
    private readonly updateUseCase: UpdateLearningResource,
    private readonly deleteUseCase: DeleteLearningResource
  ) {}

  private toDTO(resource: LearningResource): LearningResourceDTO {
    const p = resource.props;
    return {
      id: p.id,
      uploaderId: p.uploaderId,
      title: p.title,
      description: p.description,
      url: p.url,
      tagIds: [...p.tagIds],
      createdAt: p.createdAt.toISOString(),
    };
  }

  async create(data: { title: string; description: string; url: string; tagIds?: string[] }, uploaderId: string) {
    const resource = await this.createUseCase.execute({ ...data, uploaderId });
    return this.toDTO(resource);
  }

  async getOne(id: string) {
    const resource = await this.getOneUseCase.execute(id);
    return this.toDTO(resource);
  }

  async list(pageNumber: number, pageSize: number, filters: LearningResourceFilters) {
    const { list, count } = await this.listUseCase.execute(pageNumber, pageSize, filters);
    return {
      list: list.map(r => this.toDTO(r)),
      count,
    };
  }

  async update(id: string, updates: { title?: string; description?: string; url?: string; tagIds?: string[] }) {
    const resource = await this.updateUseCase.execute(id, updates);
    return this.toDTO(resource);
  }

  async delete(id: string) {
    await this.deleteUseCase.execute(id);
    return true;
  }
}