import { Models } from "@packages/nexus-api-contracts/models";
import {
  learningResourceRepositoryInstance,
  ExternalResourceRepository,
} from "./externalResource.repository.js";
import { handleServerError, tryCatch } from "@/utils/tryCatch.util.js";
import { ServiceError } from "@/classes/ServerError.js";

export class ExternalResourceService {
  constructor(
    private readonly resourceRepository: ExternalResourceRepository = learningResourceRepositoryInstance,
  ) {}

  create = async (
    dto: Omit<Models.resourceSystem.resource.insertDTO, "uploader_id">,
    uploaderId: string,
  ) => {
    const { data, error } = await tryCatch(
      async () =>
        await this.resourceRepository.create({
          ...dto,
          uploader_id: uploaderId,
        }),
      {
        onServerError: handleServerError("creating external resource"),
      },
    );

    if (error)
      throw new ServiceError(
        "ResourceService",
        error.message,
        "Error while calling repository.create",
      );

    return data;
  };

  delete = async (resourceId: string) => {
    const { data, error } = await tryCatch(
      async () => await this.resourceRepository.delete(resourceId),
      { onServerError: handleServerError("deleting external resource") },
    );

    if (error)
      throw new ServiceError(
        "ResourceService",
        error.message,
        "Error while calling repository.delete",
      );

    return data;
  };

  update = async (
    resourceId: string,
    dto: Models.resourceSystem.resource.updateDTO,
  ) => {
    const { data, error } = await tryCatch(
      async () => await this.resourceRepository.update(resourceId, dto),
      {
        onServerError: handleServerError("updating external resource"),
      },
    );

    if (error)
      throw new ServiceError(
        "ResourceService",
        error.message,
        "Error while calling repository.update",
      );

    return data;
  };

  list = async () => {
    const { data, error } = await tryCatch(
      async () => await this.resourceRepository.list(),
      {
        onServerError: handleServerError("listing external resources"),
      },
    );

    if (error)
      throw new ServiceError(
        "ResourceService",
        error.message,
        "Error while calling repository.list",
      );

    return data;
  };

  getOne = async (resourceId: string) => {
    const { data, error } = await tryCatch(
      async () => await this.resourceRepository.getOne(resourceId),
      {
        onServerError: handleServerError("getting external resource"),
      },
    );

    if (error)
      throw new ServiceError(
        "ResourceService",
        error.message,
        "Error while calling repository.getOne",
      );

    return data;
  };
}

export const resourceServiceInstance = new ExternalResourceService();
