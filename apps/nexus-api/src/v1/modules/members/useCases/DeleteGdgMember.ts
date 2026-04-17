import { IGdgMemberRepository } from "../domain/IGdgMemberRepository";
import { ForbiddenError } from "@/v1/errors/HttpError";

export class DeleteGdgMember {
  constructor(private readonly repo: IGdgMemberRepository) {}

  async execute(actorId: string, id: string): Promise<void> {
    if (actorId !== id) {
      throw new ForbiddenError(
        `Access denied. User '${actorId}' cannot modify member '${id}'.`,
      );
    }

    await this.repo.deleteByGdgId(id);
  }
}
