import { StudyJam, StudyJamUpdateProps } from "./StudyJam";

export type StudyJamFilters = {
  search?: string;
  createdFrom?: string;
  createdTo?: string;
};

export interface IStudyJamRepository {
  findById(id: string): Promise<StudyJam | null>;
  findAll(
    pageNumber: number,
    pageSize: number,
    filters?: StudyJamFilters,
  ): Promise<{ list: StudyJam[]; count: number }>;
  saveNew(studyJam: StudyJam): Promise<StudyJam>;
  persistUpdates(studyJam: StudyJam): Promise<StudyJam>;
  delete(id: string): Promise<void>;
}

export type { StudyJamUpdateProps };
