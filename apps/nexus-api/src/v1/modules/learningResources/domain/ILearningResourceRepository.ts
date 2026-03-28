import { LearningResource } from "./LearningResource";

export interface LearningResourceFilters {
  search?: string;
  teamId?: string;
  eventId?: string;
}

export interface ILearningResourceRepository {
  findById(id: string): Promise<LearningResource | null>;
  findAll(pageNumber: number, pageSize: number, filters?: LearningResourceFilters): Promise<{ list: LearningResource[]; count: number }>;
  findByTag(tag: string, pageNumber: number, pageSize: number): Promise<{ list: LearningResource[]; count: number }>;
  search(query: string, limit: number): Promise<LearningResource[]>;
  saveNew(learningResource: LearningResource): Promise<LearningResource>;
  persistUpdates(learningResource: LearningResource): Promise<LearningResource>;
  delete(id: string): Promise<void>;
}
