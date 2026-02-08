import { RepositoryError_DEPRECATED } from "@/classes/ServerError.js";
import {
  externalResourceRepositoryInstance,
  ExternalResourceRepository,
} from "./externalResource.repository.js";
import type { ExternalResourceListFilters } from "./externalResource.repository.js";
import { tryCatch, tryCatch_deprecated } from "@/utils/tryCatch.util.js"; 
import { models } from "@packages/nexus-api-contracts";

type updateDTO = models.learningResourceSystem.externalResource.update;
type insertDTO = models.learningResourceSystem.externalResource.insert;

/**
 * Service for managing external resources.
 * This class encapsulates the business logic for external resources,
 * interacting with the repository layer for data access.
 */
export class ExternalResourceService {
  constructor(
    private readonly resourceRepository: ExternalResourceRepository = externalResourceRepositoryInstance,
  ) {}

  /**
   * Creates a new external resource.
   * @returns The created resource.
   * @throws {RepositoryError} If the repository operation fails.
   */
  create = async (dto: insertDTO, uploaderId: string) => {
    const { data, error } = await tryCatch_deprecated(
      async () =>
        await this.resourceRepository.create({
          ...dto,
          uploader_id: uploaderId,
        }),
      "creating external resource",
    );

    if (error) throw new RepositoryError_DEPRECATED(error.message);

    return data;
  };

  /**
   * Deletes an external resource.
   * @returns The deleted resource.
   * @throws {RepositoryError} If the repository operation fails.
   */
  delete = async (resourceId: string) => {
    const { data, error } = await tryCatch_deprecated(
      async () => await this.resourceRepository.delete(resourceId),
      "deleting external resource",
    );

    if (error) throw new RepositoryError_DEPRECATED(error.message);

    return data;
  };

  /**
   * Updates an external resource.
   * @returns The updated resource.
   * @throws {RepositoryError} If the repository operation fails.
   */
  update = async (resourceId: string, dto: updateDTO) => {
    const { data, error } = await tryCatch_deprecated(
      async () => await this.resourceRepository.update(resourceId, dto),
      "updating external resource",
    );

    if (error) throw new RepositoryError_DEPRECATED(error.message);

    return data;
  };

  /**
   * Lists external resources with pagination and filtering.
   * @returns A list of resources and the total count.
   * @throws {RepositoryError} If the repository operation fails.
   */
  list = async (
    pageNumber: number,
    pageSize: number,
    filters: ExternalResourceListFilters,
  ) => {
    const { data, error } = await tryCatch_deprecated(
      async () =>
        await this.resourceRepository.list(pageNumber, pageSize, filters),
      "listing external resources",
    );

    if (error) throw new RepositoryError_DEPRECATED(error.message);

    return data;
  };

  /**
   * Gets a single external resource by its ID.
   * @returns The fetched resource.
   * @throws {RepositoryError} If the repository operation fails.
   */
  getOne = async (resourceId: string) => {
    const { data, error } = await tryCatch_deprecated(
      async () => await this.resourceRepository.getOne(resourceId),
      "getting external resource",
    );

    if (error) throw new RepositoryError_DEPRECATED(error.message);

    return data;
  };
}

export const resourceServiceInstance = new ExternalResourceService();
export type { ExternalResourceListFilters } from "./externalResource.repository.js";
