import { ValidationError } from "@/v1/errors/HttpError";
import { IMemberProjectRepository } from "../domain/IMemberProjectRepository";

export type ReorderMemberProjectsInput = {
  memberGdgId: string;
  fromIndex: number;
  toIndex: number;
};

export class ReorderMemberProjects {
  constructor(private readonly repository: IMemberProjectRepository) {}

  async execute(input: ReorderMemberProjectsInput): Promise<void> {
    if (!Number.isInteger(input.fromIndex) || input.fromIndex < 0) {
      throw new ValidationError("fromIndex must be a non-negative integer.");
    }

    if (!Number.isInteger(input.toIndex) || input.toIndex < 0) {
      throw new ValidationError("toIndex must be a non-negative integer.");
    }

    await this.repository.reorderByMember(
      input.memberGdgId,
      input.fromIndex,
      input.toIndex,
    );
  }
}
