import { RequestHandler } from "express";
import {
  StudyJamService,
  resourceServiceInstance,
} from "./studyJam.service.js";
import { contract, models } from "@packages/nexus-api-contracts";
import {
  ControllerError,
  ServerError,
  ServiceError,
} from "@/classes/ServerError.js";
import { createExpressController } from "@packages/typed-rest";
import { handleServerError, tryCatch } from "@/utils/tryCatch.util.js";

export class StudyJamController {
  constructor(
    private readonly resourceService: StudyJamService = resourceServiceInstance,
  ) {}

  createStudyJam: RequestHandler = createExpressController(
    contract.api.learning_resource_system.study_jams.POST,
    async ({ input, output, ctx }) => {
      const { res, req } = ctx;
      const user = req.user!;
      const userId = user.id;

      const { data, error } = await tryCatch(
        async () => await this.resourceService.create(input.body.data, userId),
        "creating external resource",
      );

      if (error) throw new ServiceError(error.message);

      return output(200, {
        status: "success",
        message: "Resource created successfully",
        data,
      });
    },
  );

  deleteStudyJam: RequestHandler = createExpressController(
    contract.api.learning_resource_system.study_jams.studyJamId.DELETE,
    async ({ input, output, ctx }) => {
      const resourceId = input.params.studyJamId;
      const { error } = await tryCatch(
        async () => await this.resourceService.delete(resourceId),
        "deleting external resource",
      );

      if (error) throw new ServiceError(error.message);

      return output(200, {
        status: "success",
        message: "Resource deleted successfully",
      });
    },
  );

  updateStudyJam: RequestHandler = createExpressController(
    contract.api.learning_resource_system.study_jams.studyJamId.PATCH,
    async ({ input, output, ctx }) => {
      const resourceId = input.params.studyJamId;
      const { data, error } = await tryCatch(
        async () =>
          await this.resourceService.update(resourceId, input.body.data),
        "updating external resource",
      );

      if (error) throw new ServiceError(error.message);

      return output(200, {
        status: "success",
        message: "Resource updated successfully",
        data,
      });
    },
  );

  listStudyJams: RequestHandler = createExpressController(
    contract.api.learning_resource_system.study_jams.GET,
    async ({ input, output, ctx }) => {
      const pageNumber = input.query.pageNumber;
      const pageSize = input.query.pageSize;
      const { data, error } = await tryCatch(
        async () => await this.resourceService.list(),
        "listing external resources",
      );

      if (error) throw new ServiceError(error.message);

      return output(200, {
        status: "success",
        message: "Resources fetched successfully",
        data: data.list,
        meta: {
          totalRecords: data.count,
          currentPage: pageNumber,
          pageSize,
          totalPages: Math.ceil(data.count / pageSize),
        },
      });
    },
  );

  getOneStudyJam: RequestHandler = createExpressController(
    contract.api.learning_resource_system.study_jams.studyJamId.GET,
    async ({ input, output, ctx }) => {
      const resourceId = input.params.studyJamId as string;
      const { data, error } = await tryCatch(
        async () => await this.resourceService.getOne(resourceId),
        "getting one external resource",
      );

      if (error) throw new ServiceError(error.message);

      return output(200, {
        status: "success",
        message: "Resource fetched successfully",
        data,
      });
    },
  );
}

export const studyJamControllerInstance = new StudyJamController();
