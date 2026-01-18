import { Models } from "@packages/nexus-api-contracts/models";
import {
  learningResourceRepositoryInstance,
  ExternalResourceRepository,
} from "./externalResource.repository.js";
import { rethrowServerError, tryCatchHandled } from "@/utils/tryCatch.util.js";
import { ServiceError } from "@/classes/ServerError.js";

export class ExternalResourceService {
  constructor(
    private readonly resourceRepository: ExternalResourceRepository = learningResourceRepositoryInstance,
  ) {}

  create = async (
    dto: Omit<Models.resourceSystem.resource.insertDTO, "uploader_id">,
    uploaderId: string,
  ) => {
    const { data, error } = await tryCatchHandled(
      async () =>
        await this.resourceRepository.create({
          ...dto,
          uploader_id: uploaderId,
        }),
      {
        onServerError: rethrowServerError("creating external resource"),
      },
    );

    if (error)
      throw new ServiceError("ResourceService", "create", error.message);

    return data;
  };

  delete = async (resourceId: string) => {
    const { data, error } = await tryCatchHandled(
      async () => await this.resourceRepository.delete(resourceId),
      { onServerError: rethrowServerError("deleting external resource") },
    );

    if (error)
      throw new ServiceError("ResourceService", "delete", error.message);

    return data;
  };

  update = async (
    resourceId: string,
    dto: Models.resourceSystem.resource.updateDTO,
  ) => {
    const { data, error } = await tryCatchHandled(
      async () => await this.resourceRepository.update(resourceId, dto),
      {
        onServerError: rethrowServerError("updating external resource"),
      },
    );

    if (error)
      throw new ServiceError("ResourceService", "update", error.message);

    return data;
  };

  list = async () => {
    const { data, error } = await tryCatchHandled(
      async () => await this.resourceRepository.list(),
      {
        onServerError: rethrowServerError("listing external resources"),
      },
    );

    if (error) throw new ServiceError("ResourceService", "list", error.message);

    return data;
  };

  getOne = async (resourceId: string) => {
    const { data, error } = await tryCatchHandled(
      async () => await this.resourceRepository.getOne(resourceId),
      {
        onServerError: rethrowServerError("getting external resource"),
      },
    );

    if (error)
      throw new ServiceError("ResourceService", "getOne", error.message);

    return data;
  };
}

export const resourceServiceInstance = new ExternalResourceService();
