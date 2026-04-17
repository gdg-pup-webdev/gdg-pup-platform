import {
  MemberProject,
  MEMBER_PROJECT_MAX_IMAGES,
  MEMBER_PROJECT_MAX_PER_MEMBER,
} from "../domain/MemberProject";
import { IMemberProjectRepository } from "../domain/IMemberProjectRepository";
import { IMemberService } from "../domain/IMemberService";
import {
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "@/v1/errors/HttpError";

export type CreateMemberProjectInput = {
  actorId: string;
  title: string;
  startDate: Date;
  endDate: Date | null;
  description: string;
  images?: string[];
  memberGdgId: string;
};

export class CreateMemberProject {
  constructor(
    private repository: IMemberProjectRepository,
    private memberModule: IMemberService,
  ) {}

  async execute(input: CreateMemberProjectInput): Promise<MemberProject> {
    if (input.actorId !== input.memberGdgId) {
      throw new ForbiddenError(
        `Access denied. User '${input.actorId}' cannot modify member '${input.memberGdgId}'.`,
      );
    }

    const memberExists = await this.memberModule.memberExistsByGdgId(
      input.memberGdgId,
    );
    if (!memberExists) {
      throw new NotFoundError(
        `Member with GDG ID ${input.memberGdgId} not found`,
      );
    }

    const { count: existingProjectsCount } =
      await this.repository.findByMemberGdgId(input.memberGdgId, 1, 1);

    if (existingProjectsCount >= MEMBER_PROJECT_MAX_PER_MEMBER) {
      throw new ValidationError(
        `A member can only create up to ${MEMBER_PROJECT_MAX_PER_MEMBER} projects.`,
      );
    }

    const images = [...(input.images || [])].filter(
      (image): image is string => typeof image === "string" && image.length > 0,
    );

    if (images.length > MEMBER_PROJECT_MAX_IMAGES) {
      throw new ValidationError(
        `A member project can only contain up to ${MEMBER_PROJECT_MAX_IMAGES} images.`,
      );
    }

    const project = MemberProject.create({
      title: input.title,
      startDate: input.startDate,
      endDate: input.endDate,
      description: input.description,
      images,
      memberGdgId: input.memberGdgId,
    });

    return await this.repository.saveNew(project);
  }
}
