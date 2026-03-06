import { IStudyJamRepository } from "../domain/IStudyJamRepository";
import { StudyJam } from "../domain/StudyJam";

export class GetOneStudyJam {
  constructor(private readonly repo: IStudyJamRepository) {}

  async execute(id: string): Promise<StudyJam> {
    const studyJam = await this.repo.findById(id);
    if (!studyJam) {
      throw new Error(`Study Jam with ID ${id} not found.`);
    }
    return studyJam;
  }
}