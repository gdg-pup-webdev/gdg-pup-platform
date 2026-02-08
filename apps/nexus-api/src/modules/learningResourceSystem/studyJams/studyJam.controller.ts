import { RequestHandler } from "express";
import {
  StudyJamService,
  type StudyJamListFilters,
  resourceServiceInstance,
} from "./studyJam.service.js";
import { contract } from "@packages/nexus-api-contracts";
import { createExpressController } from "@packages/typed-rest";
import {
  buildPaginationMeta,
  normalizeOptionalText,
  runServiceCall,
} from "../controller.utils.js";

/**
 * Controller for handling study jam-related requests.
 * Manages the flow of data between the client and the StudyJamService.
 */
export class StudyJamController {
  constructor(
    private readonly resourceService: StudyJamService = resourceServiceInstance,
  ) {}

  /**
   * Handles the creation of a new study jam.
   * Extracts study jam data and user ID from the request, then calls the service to create the study jam.
   * @returns A success response with the created study jam data.
   * @throws {ServiceError} If the study jam creation fails.
   */
  createStudyJam: RequestHandler = createExpressController(
    contract.api.learning_resource_system.study_jams.POST,
    async ({ input, output, ctx }) => {
      const data = await runServiceCall(
        async () =>
          await this.resourceService.create(input.body.data, ctx.req.user!.id),
        "creating study jam",
      );

      return output(200, {
        status: "success",
        message: "Study jam created successfully",
        data,
      });
    },
  );

  /**
   * Handles the deletion of a study jam.
   * Extracts the study jam ID from the request parameters and calls the service to delete it.
   * @returns A success response confirming the deletion.
   * @throws {ServiceError} If the study jam deletion fails.
   */
  deleteStudyJam: RequestHandler = createExpressController(
    contract.api.learning_resource_system.study_jams.studyJamId.DELETE,
    async ({ input, output }) => {
      const resourceId = input.params.studyJamId;
      await runServiceCall(
        async () => await this.resourceService.delete(resourceId),
        "deleting study jam",
      );

      return output(200, {
        status: "success",
        message: "Study jam deleted successfully",
      });
    },
  );

  /**
   * Handles the update of a study jam.
   * Extracts the study jam ID and update data from the request, then calls the service to perform the update.
   * @returns A success response with the updated study jam data.
   * @throws {ServiceError} If the study jam update fails.
   */
  updateStudyJam: RequestHandler = createExpressController(
    contract.api.learning_resource_system.study_jams.studyJamId.PATCH,
    async ({ input, output }) => {
      const resourceId = input.params.studyJamId;
      const data = await runServiceCall(
        async () =>
          await this.resourceService.update(resourceId, input.body.data),
        "updating study jam",
      );

      return output(200, {
        status: "success",
        message: "Study jam updated successfully",
        data,
      });
    },
  );

  /**
   * Handles listing study jams with pagination and filtering.
   * Extracts pagination and filter parameters from the request query and calls the service to fetch the study jams.
   * @returns A success response with the list of study jams and pagination metadata.
   * @throws {ServiceError} If fetching the study jams fails.
   */
  listStudyJams: RequestHandler = createExpressController(
    contract.api.learning_resource_system.study_jams.GET,
    async ({ input, output }) => {
      const { pageNumber, pageSize, search, createdFrom, createdTo } =
        input.query;
      const normalizedSearch = normalizeOptionalText(search);
      const filters: StudyJamListFilters = {
        ...(normalizedSearch ? { search: normalizedSearch } : {}),
        ...(createdFrom ? { createdFrom } : {}),
        ...(createdTo ? { createdTo } : {}),
      };

      const data = await runServiceCall(
        async () =>
          await this.resourceService.list(pageNumber, pageSize, filters),
        "listing study jams",
      );

      return output(200, {
        status: "success",
        message: "Study jams fetched successfully",
        data: data.list,
        meta: buildPaginationMeta(data.count, pageNumber, pageSize),
      });
    },
  );

  /**
   * Handles fetching a single study jam by its ID.
   * Extracts the study jam ID from the request parameters and calls the service to fetch the study jam.
   * @returns A success response with the fetched study jam data.
   * @throws {ServiceError} If fetching the study jam fails.
   */
  getOneStudyJam: RequestHandler = createExpressController(
    contract.api.learning_resource_system.study_jams.studyJamId.GET,
    async ({ input, output }) => {
      const resourceId = input.params.studyJamId;
      const data = await runServiceCall(
        async () => await this.resourceService.getOne(resourceId),
        "getting one study jam",
      );

      return output(200, {
        status: "success",
        message: "Study jam fetched successfully",
        data,
      });
    },
  );
}

export const studyJamControllerInstance = new StudyJamController();
