import { buildPaginationMeta } from "@/v1/utils/controller.utils";
import { studyJamController } from "@/v1/modules/studyJams";
import { StudyJamDTO } from "@/v1/modules/studyJams/StudyJamController";
import { teamModuleController } from "@/v1/modules/teamsSystem";
import { UnauthorizedError } from "@/v1/errors/HttpError";
import { contract } from "@packages/nexus-api-contracts";
import { createExpressController } from "@packages/typed-rest/serverExpress";
import { RequestHandler } from "express";

type StudyJamRow = {
  id: string;
  created_at: string;
  updated_at: string | null;
  uploader_id: string | null;
  title: string;
  team_id: string | null;
  description: string;
  image_url: string | null;
  tags: string[];
  categories: string[];
  recording_url: string | null;
  summary: string;
};

function toStudyJamRow(
  studyJam: StudyJamDTO,
  extras: Partial<StudyJamRow> = {},
): StudyJamRow {
  return {
    id: studyJam.id,
    created_at: studyJam.createdAt.toISOString(),
    updated_at: extras.updated_at ?? studyJam.updatedAt?.toISOString() ?? null,
    uploader_id: extras.uploader_id ?? studyJam.creatorId,
    title: studyJam.title,
    team_id: extras.team_id ?? null,
    description: studyJam.description,
    image_url: extras.image_url ?? null,
    tags: extras.tags ?? [],
    categories: extras.categories ?? [],
    recording_url: extras.recording_url ?? studyJam.recordingUrl,
    summary: studyJam.summary,
  };
}

export class StudyJamsHttpController {
  listStudyJams: RequestHandler = createExpressController(
    contract.api.v1.study_jams.GET,
    async ({ input, output }) => {
      const pageNumber = input.query.pageNumber || 1;
      const pageSize = input.query.pageSize || 10;

      const { list, count } = await studyJamController.list(
        pageNumber,
        pageSize,
        {
          search: input.query.search,
          createdFrom: input.query.createdFrom,
          createdTo: input.query.createdTo,
        },
      );

      return output(200, {
        status: "success",
        message: "Study jams fetched successfully",
        data: list.map((studyJam: StudyJamDTO) => toStudyJamRow(studyJam)),
        meta: buildPaginationMeta(count, pageNumber, pageSize),
      });
    },
  );

  createStudyJam: RequestHandler = createExpressController(
    contract.api.v1.study_jams.POST,
    async ({ input, output, ctx }) => {
      const creatorId =
        ctx.req.decodedToken?.memberInfo.gdgId ?? ctx.req.user?.id;

      if (!creatorId) {
        throw new UnauthorizedError(
          "Authentication required. No authenticated user found in request context.",
        );
      }

      if (input.body.data.team_id) {
        await teamModuleController.getTeam(input.body.data.team_id);
      }

      const studyJam = await studyJamController.create(
        {
          title: input.body.data.title,
          description: input.body.data.description,
          summary: input.body.data.summary,
          recordingUrl: input.body.data.recording_url,
        },
        creatorId,
      );

      return output(200, {
        status: "success",
        message: "Study jam created successfully",
        data: toStudyJamRow(studyJam, {
          uploader_id: creatorId,
        }),
      });
    },
  );

  getOneStudyJam: RequestHandler = createExpressController(
    contract.api.v1.study_jams.studyJamId.GET,
    async ({ input, output }) => {
      const studyJam = await studyJamController.getOne(input.params.studyJamId);

      return output(200, {
        status: "success",
        message: "Study jam fetched successfully",
        data: toStudyJamRow(studyJam),
      });
    },
  );

  updateStudyJam: RequestHandler = createExpressController(
    contract.api.v1.study_jams.studyJamId.PATCH,
    async ({ input, output }) => {
      if (input.body.data.team_id) {
        await teamModuleController.getTeam(input.body.data.team_id);
      }

      const studyJam = await studyJamController.update(
        input.params.studyJamId,
        {
          title: input.body.data.title,
          summary: input.body.data.summary,
          description: input.body.data.description,
          recordingUrl: input.body.data.recording_url,
        },
      );

      return output(200, {
        status: "success",
        message: "Study jam updated successfully",
        data: toStudyJamRow(studyJam),
      });
    },
  );

  deleteStudyJam: RequestHandler = createExpressController(
    contract.api.v1.study_jams.studyJamId.DELETE,
    async ({ input, output }) => {
      await studyJamController.delete(input.params.studyJamId);

      return output(200, {
        status: "success",
        message: "Study jam deleted successfully",
        data: true,
      });
    },
  );
}
