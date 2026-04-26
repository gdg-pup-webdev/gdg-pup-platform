import { IStudyJamRepository } from "../domain/IStudyJamRepository";
import { StudyJam, StudyJamUpdateProps } from "../domain/StudyJam";
import { NotFoundError } from "@/v1/errors/HttpError";

export class UpdateStudyJam {
  constructor(private readonly repo: IStudyJamRepository) {}

  async execute(id: string, updates: StudyJamUpdateProps): Promise<StudyJam> {
    const studyJam = await this.repo.findById(id);

    if (!studyJam) {
      throw new NotFoundError(
        `Cannot update: Study Jam with ID ${id} not found.`,
      );
    }

    studyJam.update(updates);
    return this.repo.persistUpdates(studyJam);
  }
}
