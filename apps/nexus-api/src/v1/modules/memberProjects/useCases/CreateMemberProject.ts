import { MemberProject } from "../domain/MemberProject";
import { IMemberProjectRepository } from "../domain/IMemberProjectRepository";
import { IMemberService } from "../domain/IMemberService";
import { NotFoundError, ValidationError } from "@/v1/errors/HttpError";

export type CreateMemberProjectInput = {
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
    const memberExists = await this.memberModule.memberExistsByGdgId(
      input.memberGdgId,
    );
    if (!memberExists) {
      throw new NotFoundError(
        `Member with GDG ID ${input.memberGdgId} not found`,
      );
    }

    const images = [...(input.images || [])].filter(
      (image): image is string => typeof image === "string" && image.length > 0,
    );

    if (images.length > 4) {
      throw new ValidationError(
        "A member project can only contain up to 4 images.",
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
