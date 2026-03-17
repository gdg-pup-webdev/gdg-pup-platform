import { ITeamResourceRepository } from "../domain/ITeamResourceRepository";
import { TeamResource, TeamResourceInsertProps } from "../domain/TeamResource";

export class CreateTeamResource {
  constructor(private readonly repo: ITeamResourceRepository) {}

  async execute(props: TeamResourceInsertProps): Promise<TeamResource> {
    if (!props.title || !props.description || !props.resourceLink) {
      throw new Error("Title, description, and resource link are required.");
    }
    const teamResource = TeamResource.create(props);
    return await this.repo.saveNew(teamResource);
  }
}
