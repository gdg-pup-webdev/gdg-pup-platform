import { tryCatch } from "@/utils/tryCatch.util.js";
import { RepositoryError_DEPRECATED } from "@/classes/ServerError.js";
import { models } from "@packages/nexus-api-contracts";
import {
  studyJamRepositoryInstance,
  StudyJamRepository,
} from "./studyJam.repository.js";

type updateDTO = models.learningResourceSystem.studyJam.update;
type insertDTO = models.learningResourceSystem.studyJam.insert;

export class StudyJamService {
  constructor(
    private readonly resourceRepository: StudyJamRepository = studyJamRepositoryInstance,
  ) {}

  create = async (dto: insertDTO, uploaderId: string) => {
    const { data, error } = await tryCatch(
      async () => await this.resourceRepository.create(dto),
      "creating external resource",
    );

    if (error) throw new RepositoryError_DEPRECATED(error.message);

    return data;
  };

  delete = async (resourceId: string) => {
    const { data, error } = await tryCatch(
      async () => await this.resourceRepository.delete(resourceId),
      "deleting external resource",
    );

    if (error) throw new RepositoryError_DEPRECATED(error.message);

    return data;
  };

  update = async (resourceId: string, dto: updateDTO) => {
    const { data, error } = await tryCatch(
      async () => await this.resourceRepository.update(resourceId, dto),
      "updating external resource",
    );

    if (error) throw new RepositoryError_DEPRECATED(error.message);

    return data;
  };

  list = async () => {
    const { data, error } = await tryCatch(
      async () => await this.resourceRepository.list(),
      "listing external resources",
    );

    if (error) throw new RepositoryError_DEPRECATED(error.message);

    return data;
  };

  getOne = async (resourceId: string) => {
    const { data, error } = await tryCatch(
      async () => await this.resourceRepository.getOne(resourceId),
      "getting external resource",
    );

    if (error) throw new RepositoryError_DEPRECATED(error.message);

    return data;
  };
}

export const resourceServiceInstance = new StudyJamService();
