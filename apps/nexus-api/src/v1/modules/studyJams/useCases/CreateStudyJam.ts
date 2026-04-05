import { IStudyJamRepository } from "../domain/IStudyJamRepository";
import { StudyJam } from "../domain/StudyJam";
import { BadRequestError } from "@/v1/errors/HttpError";

export type CreateStudyJamInput = {
  creatorId: string;
  title: string;
  summary: string;
  description: string;
  recordingUrl?: string | null;
};

export class CreateStudyJam {
  constructor(private readonly repo: IStudyJamRepository) {}

  async execute(input: CreateStudyJamInput): Promise<StudyJam> {
    if (!input.title || !input.description) {
      throw new BadRequestError("Title and description are required.");
    }

    const studyJam = StudyJam.create({
      creatorId: input.creatorId,
      title: input.title,
      summary: input.summary,
      description: input.description,
      recordingUrl: input.recordingUrl ?? null,
    });

    return await this.repo.saveNew(studyJam);
  }
}
