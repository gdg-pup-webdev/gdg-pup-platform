import { RepositoryError_DEPRECATED } from "@/classes/ServerError.js";
import {
  externalResourceRepositoryInstance,
  ExternalResourceRepository,
} from "./externalResource.repository.js";
import type { ExternalResourceListFilters } from "./externalResource.repository.js";
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
    return await this.resourceRepository.create({
      ...dto,
      uploader_id: uploaderId,
    });
  };

  /**
   * Deletes an external resource.
   * @returns The deleted resource.
   * @throws {RepositoryError} If the repository operation fails.
   */
  delete = async (resourceId: string) => {
    return await this.resourceRepository.delete(resourceId);
  };

  /**
   * Updates an external resource.
   * @returns The updated resource.
   * @throws {RepositoryError} If the repository operation fails.
   */
  update = async (resourceId: string, dto: updateDTO) => {
    return await this.resourceRepository.update(resourceId, dto);
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
    return await this.resourceRepository.list(pageNumber, pageSize, filters);
  };

  /**
   * Gets a single external resource by its ID.
   * @returns The fetched resource.
   * @throws {RepositoryError} If the repository operation fails.
   */
  getOne = async (resourceId: string) => {
    return await this.resourceRepository.getOne(resourceId);
  };
}

export const resourceServiceInstance = new ExternalResourceService();
export type { ExternalResourceListFilters } from "./externalResource.repository.js";
