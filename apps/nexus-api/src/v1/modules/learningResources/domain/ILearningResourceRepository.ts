import { LearningResource, LearningResourceType } from "./LearningResource";

export interface LearningResourceFilters {
  search?: string;
  type?: LearningResourceType;
  teamId?: string;
  eventId?: string;
}

export interface ILearningResourceRepository {
  findById(id: string): Promise<LearningResource | null>;
  findAll(pageNumber: number, pageSize: number, filters?: LearningResourceFilters): Promise<{ list: LearningResource[]; count: number }>;
  saveNew(learningResource: LearningResource): Promise<LearningResource>;
  persistUpdates(learningResource: LearningResource): Promise<LearningResource>;
  delete(id: string): Promise<void>;
}
