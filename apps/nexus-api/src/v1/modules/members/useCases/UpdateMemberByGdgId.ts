import { IGdgMemberRepository } from "../domain/IGdgMemberRepository";
import { GdgMember, GdgMemberUpdateProps } from "../domain/GdgMember";
import { ForbiddenError } from "@/v1/errors/HttpError";

export class UpdateMemberByGdgId {
  constructor(private readonly repo: IGdgMemberRepository) {}

  async execute(
    actorId: string,
    gdgId: string,
    updates: GdgMemberUpdateProps,
  ): Promise<GdgMember> {
    if (actorId !== gdgId) {
      throw new ForbiddenError(
        `Access denied. User '${actorId}' cannot modify member '${gdgId}'.`,
      );
    }

    const member = await this.repo.findByGdgId(gdgId);
    if (!member) throw new Error("GdgMember not found");

    member.update(updates);
    return await this.repo.persistUpdates(member);
  }
}
