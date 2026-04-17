import {
  MemberProject,
  MEMBER_PROJECT_MAX_IMAGES,
} from "../domain/MemberProject";
import { IMemberProjectRepository } from "../domain/IMemberProjectRepository";
import {
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "@/v1/errors/HttpError";

export type UpdateMemberProjectInput = {
  actorId: string;
  id: string;
  title?: string;
  startDate?: Date;
  endDate?: Date | null;
  description?: string;
  images?: string[];
};

export class UpdateMemberProject {
  constructor(private repository: IMemberProjectRepository) {}

  async execute(input: UpdateMemberProjectInput): Promise<MemberProject> {
    const project = await this.repository.findById(input.id);
    if (!project) {
      throw new NotFoundError(`Member Project with ID ${input.id} not found`);
    }

    if (input.actorId !== project.props.memberGdgId) {
      throw new ForbiddenError(
        `Access denied. User '${input.actorId}' cannot modify member '${project.props.memberGdgId}'.`,
      );
    }

    if (input.images !== undefined) {
      if (input.images.length > MEMBER_PROJECT_MAX_IMAGES) {
        throw new ValidationError(
          `A member project can only contain up to ${MEMBER_PROJECT_MAX_IMAGES} images.`,
        );
      }
      try {
        project.update({ images: input.images });
      } catch (error) {
        throw new ValidationError((error as Error).message, error);
      }
    }

    project.update({
      title: input.title,
      startDate: input.startDate,
      endDate: input.endDate,
      description: input.description,
    });

    return await this.repository.persistUpdates(project);
  }
}
