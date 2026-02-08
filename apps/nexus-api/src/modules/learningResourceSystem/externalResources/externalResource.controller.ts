import { RequestHandler } from "express";
import {
  ExternalResourceService,
  type ExternalResourceListFilters,
  resourceServiceInstance,
} from "./externalResource.service.js";
import { contract } from "@packages/nexus-api-contracts";
import { createExpressController } from "@packages/typed-rest";
import {
  buildPaginationMeta,
  normalizeOptionalText,
  runServiceCall,
} from "../controller.utils.js";

/**
 * Controller for handling external resource-related requests.
 * Manages the flow of data between the client and the ExternalResourceService.
 */
export class ExternalResourceController {
  constructor(
    private readonly resourceService: ExternalResourceService = resourceServiceInstance,
  ) {}

  /**
   * Handles the creation of a new external resource.
   * Extracts resource data and user ID from the request, then calls the service to create the resource.
   * @returns A success response with the created resource data.
   * @throws {ServiceError} If the resource creation fails.
   */
  createExternalResource: RequestHandler = createExpressController(
    contract.api.learning_resource_system.external_resources.POST,
    async ({ input, output, ctx }) => {
      const data = await runServiceCall(
        async () =>
          await this.resourceService.create(input.body.data, ctx.req.user!.id),
        "creating external resource",
      );

      return output(200, {
        status: "success",
        message: "External resource created successfully",
        data,
      });
    },
  );

  /**
   * Handles the deletion of an external resource.
   * Extracts the resource ID from the request parameters and calls the service to delete it.
   * @returns A success response confirming the deletion.
   * @throws {ServiceError} If the resource deletion fails.
   */
  deleteExternalResource: RequestHandler = createExpressController(
    contract.api.learning_resource_system.external_resources.externalResourceId
      .DELETE,
    async ({ input, output }) => {
      const resourceId = input.params.externalResourceId;
      await runServiceCall(
        async () => await this.resourceService.delete(resourceId),
        "deleting external resource",
      );

      return output(200, {
        status: "success",
        message: "External resource deleted successfully",
      });
    },
  );

  /**
   * Handles the update of an external resource.
   * Extracts the resource ID and update data from the request, then calls the service to perform the update.
   * @returns A success response with the updated resource data.
   * @throws {ServiceError} If the resource update fails.
   */
  updateExternalResource: RequestHandler = createExpressController(
    contract.api.learning_resource_system.external_resources.externalResourceId
      .PATCH,
    async ({ input, output }) => {
      const resourceId = input.params.externalResourceId;
      const data = await runServiceCall(
        async () =>
          await this.resourceService.update(resourceId, input.body.data),
        "updating external resource",
      );

      return output(200, {
        status: "success",
        message: "External resource updated successfully",
        data,
      });
    },
  );

  /**
   * Handles listing external resources with pagination and filtering.
   * Extracts pagination and filter parameters from the request query and calls the service to fetch the resources.
   * @returns A success response with the list of resources and pagination metadata.
   * @throws {ServiceError} If fetching the resources fails.
   */
  listExternalResources: RequestHandler = createExpressController(
    contract.api.learning_resource_system.external_resources.GET,
    async ({ input, output }) => {
      const {
        pageNumber,
        pageSize,
        search,
        createdFrom,
        createdTo,
        uploaderId,
        tagIds,
      } = input.query;
      const normalizedSearch = normalizeOptionalText(search);
      const normalizedTagIds = tagIds
        ? tagIds
          .split(",")
          .map((tagId) => tagId.trim())
          .filter((tagId) => tagId.length > 0)
        : undefined;
      const filters: ExternalResourceListFilters = {
        ...(normalizedSearch ? { search: normalizedSearch } : {}),
        ...(createdFrom ? { createdFrom } : {}),
        ...(createdTo ? { createdTo } : {}),
        ...(uploaderId ? { uploaderId } : {}),
        ...(normalizedTagIds && normalizedTagIds.length > 0
          ? { tagIds: normalizedTagIds }
          : {}),
      };

      const data = await runServiceCall(
        async () =>
          await this.resourceService.list(pageNumber, pageSize, filters),
        "listing external resources",
      );

      return output(200, {
        status: "success",
        message: "External resources fetched successfully",
        data: data.list,
        meta: buildPaginationMeta(data.count, pageNumber, pageSize),
      });
    },
  );

  /**
   * Handles fetching a single external resource by its ID.
   * Extracts the resource ID from the request parameters and calls the service to fetch the resource.
   * @returns A success response with the fetched resource data.
   * @throws {ServiceError} If fetching the resource fails.
   */
  getOneExternalResource: RequestHandler = createExpressController(
    contract.api.learning_resource_system.external_resources.externalResourceId
      .GET,
    async ({ input, output }) => {
      const resourceId = input.params.externalResourceId;
      const data = await runServiceCall(
        async () => await this.resourceService.getOne(resourceId),
        "getting one external resource",
      );

      return output(200, {
        status: "success",
        message: "External resource fetched successfully",
        data,
      });
    },
  );
}

export const externalResourceControllerInstance =
  new ExternalResourceController();
