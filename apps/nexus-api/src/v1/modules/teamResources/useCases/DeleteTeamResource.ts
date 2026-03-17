import { ITeamResourceRepository } from "../domain/ITeamResourceRepository";
import { ITeamResourceStorage } from "../domain/ITeamResourceStorage";

export class DeleteTeamResource {
  constructor(
    private readonly repo: ITeamResourceRepository,
    private readonly storage: ITeamResourceStorage
  ) {}

  async execute(id: string): Promise<void> {
    const resource = await this.repo.findById(id);
    if (!resource) {
      throw new Error("Team resource not found.");
    }

    // Delete associated file
    await this.storage.deleteFile(resource.props.thumbnailStorageReference);

    await this.repo.delete(id);
  }
}
