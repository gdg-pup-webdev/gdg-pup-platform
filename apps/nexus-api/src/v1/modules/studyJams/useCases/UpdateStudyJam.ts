import { IStudyJamRepository } from "../domain/IStudyJamRepository";
import { StudyJam, StudyJamUpdateProps } from "../domain/StudyJam";

export class UpdateStudyJam {
  constructor(private readonly repo: IStudyJamRepository) {}

  async execute(id: string, updates: StudyJamUpdateProps): Promise<StudyJam> {
    const studyJam = await this.repo.findById(id);
    if (!studyJam) {
      throw new Error(`Cannot update: Study Jam with ID ${id} not found.`);
    }

    studyJam.update(updates);
    return await this.repo.persistUpdates(studyJam);
  }
}