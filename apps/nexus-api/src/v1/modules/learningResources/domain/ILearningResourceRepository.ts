import { LearningResource } from "./LearningResource";

export interface LearningResourceFilters {
  search?: string;
  createdFrom?: string | Date;
  createdTo?: string | Date;
  uploaderId?: string;
  tagIds?: string[];
}

export interface ILearningResourceRepository {
  findById(id: string): Promise<LearningResource | null>;
  findAll(pageNumber: number, pageSize: number, filters?: LearningResourceFilters): Promise<{ list: LearningResource[]; count: number }>;
  saveNew(resource: LearningResource): Promise<LearningResource>;
  persistUpdates(resource: LearningResource): Promise<LearningResource>;
  delete(id: string): Promise<void>;
}