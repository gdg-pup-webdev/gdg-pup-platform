import { IStudyJamRepository } from "../domain/IStudyJamRepository";
import { StudyJam } from "../domain/StudyJam";
import { NotFoundError } from "@/v1/errors/HttpError";

export class GetOneStudyJam {
  constructor(private readonly repo: IStudyJamRepository) {}

  async execute(id: string): Promise<StudyJam> {
    const studyJam = await this.repo.findById(id);

    if (!studyJam) {
      throw new NotFoundError(`Study Jam with ID ${id} not found.`);
    }

    return studyJam;
  }
}
