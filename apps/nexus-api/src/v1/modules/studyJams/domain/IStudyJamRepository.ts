import { StudyJam } from "./StudyJam";

export interface StudyJamFilters {
  search?: string;
  createdFrom?: string | Date;
  createdTo?: string | Date;
}

export interface IStudyJamRepository {
  findById(id: string): Promise<StudyJam | null>;
  findAll(pageNumber: number, pageSize: number, filters?: StudyJamFilters): Promise<{ list: StudyJam[]; count: number }>;
  saveNew(studyJam: StudyJam): Promise<StudyJam>;
  persistUpdates(studyJam: StudyJam): Promise<StudyJam>;
  delete(id: string): Promise<void>;
}