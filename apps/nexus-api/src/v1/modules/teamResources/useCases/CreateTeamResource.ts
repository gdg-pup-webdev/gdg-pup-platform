import { ITeamResourceRepository } from "../domain/ITeamResourceRepository";
import { TeamResource, TeamResourceInsertProps } from "../domain/TeamResource";
import { ITeamResourceStorage, TeamResourceFile } from "../domain/ITeamResourceStorage";
import { ITeamResourceTeamService } from "../domain/ITeamResourceTeamService";

export type CreateTeamResourceInput = Omit<TeamResourceInsertProps, "thumbnailStorageReference" | "thumbnailPublicUrl"> & {
  thumbnailImage: TeamResourceFile;
};

export class CreateTeamResource {
  constructor(
    private readonly repo: ITeamResourceRepository,
    private readonly storage: ITeamResourceStorage,
    private readonly teamService: ITeamResourceTeamService
  ) {}

  async execute(input: CreateTeamResourceInput): Promise<TeamResource> {
    if (!input.title || !input.description || !input.resourceLink) {
      throw new Error("Title, description, and resource link are required.");
    }

    if (!input.thumbnailImage) {
      throw new Error("Thumbnail image is required.");
    }

    // Check if team exists via the module's own port
    const teamExists = await this.teamService.existsByName(input.teamName);
    if (!teamExists) {
      throw new Error(`Team with name "${input.teamName}" not found.`);
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
