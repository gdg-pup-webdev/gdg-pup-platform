import { ILearningResourceRepository } from "../domain/ILearningResourceRepository";
import { LearningResource, LearningResourceUpdateProps } from "../domain/LearningResource";
import { ILearningResourceStorage, FileToUpload } from "../domain/ILearningResourceStorage";
import { ITeamModule } from "../domain/ITeamModule";
import { IEventModule } from "../domain/IEventModule";

export type UpdateLearningResourceInput = Omit<LearningResourceUpdateProps, "thumbnailUrl"> & {
  thumbnailImage?: FileToUpload;
};

export class UpdateLearningResource {
  constructor(
    private readonly repo: ILearningResourceRepository,
    private readonly storage: ILearningResourceStorage,
    private readonly teamModule: ITeamModule,
    private readonly eventModule: IEventModule
  ) {}

  async execute(id: string, input: UpdateLearningResourceInput): Promise<LearningResource> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new Error(`Learning resource with ID "${id}" not found.`);
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

    let thumbnailUrl = existing.props.thumbnailUrl;
    if (input.thumbnailImage) {
      // If there's an existing thumbnail, delete it
      if (thumbnailUrl) {
        await this.storage.deleteFile(thumbnailUrl);
      }
      const uploaded = await this.storage.uploadFile(input.thumbnailImage);
      thumbnailUrl = uploaded.publicUrl;
    }

    existing.update({
      ...input,
      thumbnailUrl,
    });

    return await this.repo.persistUpdates(existing);
  }
}
