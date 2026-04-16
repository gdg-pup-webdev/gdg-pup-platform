import {
  IStudyJamRepository,
  StudyJamFilters,
} from "../domain/IStudyJamRepository";
import { StudyJam } from "../domain/StudyJam";

export class ListStudyJams {
  constructor(private readonly repo: IStudyJamRepository) {}

  async execute(
    pageNumber: number,
    pageSize: number,
    filters: StudyJamFilters = {},
  ): Promise<{ list: StudyJam[]; count: number }> {
    return this.repo.findAll(pageNumber, pageSize, filters);
  }
}
