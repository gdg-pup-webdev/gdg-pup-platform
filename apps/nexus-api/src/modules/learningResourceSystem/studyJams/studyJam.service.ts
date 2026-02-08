import { tryCatch } from "@/utils/tryCatch.util.js";
import { RepositoryError } from "@/classes/ServerError.js";
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
    void uploaderId;
    const { data, error } = await tryCatch(
      async () => await this.resourceRepository.create(dto),
      "creating study jam",
    );

    if (error) throw new RepositoryError(error.message);

    return data;
  };

  /**
   * Deletes a study jam.
   * @returns The deleted study jam.
   * @throws {RepositoryError} If the repository operation fails.
   */
  delete = async (resourceId: string) => {
    const { data, error } = await tryCatch(
      async () => await this.resourceRepository.delete(resourceId),
      "deleting study jam",
    );

    if (error) throw new RepositoryError(error.message);

    return data;
  };

  /**
   * Updates a study jam.
   * @returns The updated study jam.
   * @throws {RepositoryError} If the repository operation fails.
   */
  update = async (resourceId: string, dto: updateDTO) => {
    const { data, error } = await tryCatch(
      async () => await this.resourceRepository.update(resourceId, dto),
      "updating study jam",
    );

    if (error) throw new RepositoryError(error.message);

    return data;
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
    const { data, error } = await tryCatch(
      async () =>
        await this.resourceRepository.list(pageNumber, pageSize, filters),
      "listing study jams",
    );

    if (error) throw new RepositoryError(error.message);

    return data;
  };

  /**
   * Gets a single study jam by its ID.
   * @returns The fetched study jam.
   * @throws {RepositoryError} If the repository operation fails.
   */
  getOne = async (resourceId: string) => {
    const { data, error } = await tryCatch(
      async () => await this.resourceRepository.getOne(resourceId),
      "getting study jam",
    );

    if (error) throw new RepositoryError(error.message);

    return data;
  };
}

export const resourceServiceInstance = new StudyJamService();
export type { StudyJamListFilters } from "./studyJam.repository.js";
