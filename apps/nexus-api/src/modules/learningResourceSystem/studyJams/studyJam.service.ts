import { models } from "@packages/nexus-api-contracts";
import {
  studyJamRepositoryInstance,
  StudyJamRepository,
} from "./studyJam.repository.js";
import type { StudyJamListFilters } from "./studyJam.repository.js";

type updateDTO = models.learningResourceSystem.studyJam.update;
type insertDTO = models.learningResourceSystem.studyJam.insert;

/**
 * Service for managing study jams.
 * This class encapsulates the business logic for study jams,
 * interacting with the repository layer for data access.
 */
export class StudyJamService {
  constructor(
    private readonly resourceRepository: StudyJamRepository = studyJamRepositoryInstance,
  ) {}

  /**
   * Creates a new study jam.
   * @returns The created study jam.
   * @throws {RepositoryError} If the repository operation fails.
   */
  create = async (dto: insertDTO, uploaderId: string) => {
    return await this.resourceRepository.create(dto);
  };

  /**
   * Deletes a study jam.
   * @returns The deleted study jam.
   * @throws {RepositoryError} If the repository operation fails.
   */
  delete = async (resourceId: string) => {
    return await this.resourceRepository.delete(resourceId);
  };

  /**
   * Updates a study jam.
   * @returns The updated study jam.
   * @throws {RepositoryError} If the repository operation fails.
   */
  update = async (resourceId: string, dto: updateDTO) => {
    return await this.resourceRepository.update(resourceId, dto);
  };

  /**
   * Lists study jams with pagination and filtering.
   * @returns A list of study jams and the total count.
   * @throws {RepositoryError} If the repository operation fails.
   */
  list = async (
    pageNumber: number,
    pageSize: number,
    filters: StudyJamListFilters,
  ) => {
    return await this.resourceRepository.list(pageNumber, pageSize, filters);
  };

  /**
   * Gets a single study jam by its ID.
   * @returns The fetched study jam.
   * @throws {RepositoryError} If the repository operation fails.
   */
  getOne = async (resourceId: string) => {
    return await this.resourceRepository.getOne(resourceId);
  };
}

export const resourceServiceInstance = new StudyJamService();
export type { StudyJamListFilters } from "./studyJam.repository.js";
