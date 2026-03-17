import { ITeamResourceRepository } from "../domain/ITeamResourceRepository";
import { TeamResource, TeamResourceInsertProps } from "../domain/TeamResource";
import { ITeamResourceStorage, TeamResourceFile } from "../domain/ITeamResourceStorage";

export type CreateTeamResourceInput = Omit<TeamResourceInsertProps, "thumbnailStorageReference" | "thumbnailPublicUrl"> & {
  thumbnailImage: TeamResourceFile;
};

export class CreateTeamResource {
  constructor(
    private readonly repo: ITeamResourceRepository,
    private readonly storage: ITeamResourceStorage
  ) {}

  async execute(input: CreateTeamResourceInput): Promise<TeamResource> {
    if (!input.title || !input.description || !input.resourceLink) {
      throw new Error("Title, description, and resource link are required.");
    }

    if (!input.thumbnailImage) {
      throw new Error("Thumbnail image is required.");
    }

    // Upload image
    const uploaded = await this.storage.uploadFile(input.thumbnailImage);

    const teamResource = TeamResource.create({
      ...input,
      thumbnailStorageReference: uploaded.storageReference,
      thumbnailPublicUrl: uploaded.publicUrl,
    });

    return await this.repo.saveNew(teamResource);
  }
}
