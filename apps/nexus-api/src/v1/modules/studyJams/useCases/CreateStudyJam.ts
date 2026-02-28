import { IStudyJamRepository } from "../domain/IStudyJamRepository";
import { StudyJam, StudyJamInsertProps } from "../domain/StudyJam";

export class CreateStudyJam {
  constructor(private readonly repo: IStudyJamRepository) {}

  async execute(props: StudyJamInsertProps): Promise<StudyJam> {
    if (!props.title || !props.description) {
      throw new Error("Title and description are required.");
    }
    const studyJam = StudyJam.create(props);
    return await this.repo.saveNew(studyJam);
  }
}