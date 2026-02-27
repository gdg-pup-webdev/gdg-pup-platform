import { IStudyJamRepository, StudyJamFilters } from "../domain/IStudyJamRepository";
import { StudyJam } from "../domain/StudyJam";

export class ListStudyJams {
  constructor(private readonly repo: IStudyJamRepository) {}

  async execute(pageNumber: number, pageSize: number, filters?: StudyJamFilters): Promise<{ list: StudyJam[]; count: number }> {
    const safePageNumber = Math.max(1, pageNumber);
    const safePageSize = Math.max(1, pageSize);
    return await this.repo.findAll(safePageNumber, safePageSize, filters);
  }
}