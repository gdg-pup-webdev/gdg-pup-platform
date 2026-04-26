import { IGdgMemberRepository } from "../domain/IGdgMemberRepository";
import { ForbiddenError } from "@/v1/errors/HttpError";

export class MakeProfilePublic {
  constructor(private readonly repo: IGdgMemberRepository) {}

  async execute(actorId: string, id: string): Promise<void> {
    if (actorId !== id) {
      throw new ForbiddenError(
        `Access denied. User '${actorId}' cannot modify member '${id}'.`,
      );
    }

    const member = await this.repo.findByGdgId(id);
    
    if (!member) {
      throw new Error(`Member not found for ID: ${id}`);
    }

    member.makePortfolioPublic();

    await this.repo.persistUpdates(member);
  }
}
