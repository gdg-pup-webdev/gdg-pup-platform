import { ITeamResourceRepository } from "../domain/ITeamResourceRepository";
import { TeamResource, TeamResourceUpdateProps } from "../domain/TeamResource";
import { ITeamResourceStorage, TeamResourceFile } from "../domain/ITeamResourceStorage";
import { ITeamResourceTeamService } from "../domain/ITeamResourceTeamService";

export type UpdateTeamResourceInput = Omit<TeamResourceUpdateProps, "thumbnailStorageReference" | "thumbnailPublicUrl"> & {
  thumbnailImage?: TeamResourceFile;
};

export class UpdateTeamResource {
  constructor(
    private readonly repo: ITeamResourceRepository,
    private readonly storage: ITeamResourceStorage,
    private readonly teamService: ITeamResourceTeamService
  ) {}

  async execute(id: string, input: UpdateTeamResourceInput): Promise<TeamResource> {
    const resource = await this.repo.findById(id);
    if (!resource) {
      throw new Error("Team resource not found.");
    }

    if (input.teamName) {
      const teamExists = await this.teamService.existsByName(input.teamName);
      if (!teamExists) {
        throw new Error(`Team with name "${input.teamName}" not found.`);
      }
    }

    const updates: TeamResourceUpdateProps = { ...input } as TeamResourceUpdateProps;

    if (input.thumbnailImage) {
      // Delete old file
      await this.storage.deleteFile(resource.props.thumbnailPublicUrl);
      
      // Upload new file
      const uploaded = await this.storage.uploadFile(input.thumbnailImage);
      updates.thumbnailStorageReference = uploaded.storageReference;
      updates.thumbnailPublicUrl = uploaded.publicUrl;
    }

    resource.update(updates);
    return await this.repo.persistUpdates(resource);
  }
}
