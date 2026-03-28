import { ILearningResourceRepository } from "../domain/ILearningResourceRepository";
import { LearningResource, LearningResourceInsertProps } from "../domain/LearningResource";
import { ILearningResourceStorage, FileToUpload } from "../domain/ILearningResourceStorage";
import { ITeamModule } from "../domain/ITeamModule";
import { IEventModule } from "../domain/IEventModule";

export type CreateLearningResourceInput = Omit<LearningResourceInsertProps, "thumbnailUrl"> & {
  thumbnailImage?: FileToUpload;
};

export class CreateLearningResource {
  constructor(
    private readonly repo: ILearningResourceRepository,
    private readonly storage: ILearningResourceStorage,
    private readonly teamModule: ITeamModule,
    private readonly eventModule: IEventModule
  ) {}

  async execute(input: CreateLearningResourceInput): Promise<LearningResource> {
    if (!input.title || !input.description || !input.url) {
      throw new Error("Title, description, and URL are required.");
    }

    if (input.teamId) {
      const teamExists = await this.teamModule.existsById(input.teamId);
      if (!teamExists) {
        throw new Error(`Team with ID "${input.teamId}" not found.`);
      }
    }

    if (input.eventId) {
      const eventExists = await this.eventModule.existsById(input.eventId);
      if (!eventExists) {
        throw new Error(`Event with ID "${input.eventId}" not found.`);
      }
    }

    let thumbnailUrl: string | null = null;
    if (input.thumbnailImage) {
      const uploaded = await this.storage.uploadFile(input.thumbnailImage);
      thumbnailUrl = uploaded.publicUrl;
    }

    const learningResource = LearningResource.create({
      ...input,
      thumbnailUrl,
    });

    return await this.repo.saveNew(learningResource);
  }
}
