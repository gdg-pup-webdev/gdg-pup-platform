import {
  MemberProject,
  MEMBER_PROJECT_MAX_IMAGES,
} from "../domain/MemberProject";
import { IMemberProjectRepository } from "../domain/IMemberProjectRepository";
import { NotFoundError, ValidationError } from "@/v1/errors/HttpError";

export type UpdateMemberProjectInput = {
  id: string;
  title?: string;
  startDate?: Date;
  endDate?: Date | null;
  description?: string;
  projectLink?: string | null;
  images?: string[];
};

export class UpdateMemberProject {
  constructor(private repository: IMemberProjectRepository) {}

  async execute(input: UpdateMemberProjectInput): Promise<MemberProject> {
    const project = await this.repository.findById(input.id);
    if (!project) {
      throw new NotFoundError(`Member Project with ID ${input.id} not found`);
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
      projectLink: input.projectLink,
    });

    return await this.repository.persistUpdates(project);
  }
}
