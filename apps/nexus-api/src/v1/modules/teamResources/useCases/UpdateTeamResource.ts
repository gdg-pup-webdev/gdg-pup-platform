import { ITeamResourceRepository } from "../domain/ITeamResourceRepository";
import { TeamResource, TeamResourceUpdateProps } from "../domain/TeamResource";

export class UpdateTeamResource {
  constructor(private readonly repo: ITeamResourceRepository) {}

  async execute(id: string, props: TeamResourceUpdateProps): Promise<TeamResource> {
    const resource = await this.repo.findById(id);
    if (!resource) {
      throw new Error("Team resource not found.");
    }
    resource.update(props);
    return await this.repo.persistUpdates(resource);
  }
}
