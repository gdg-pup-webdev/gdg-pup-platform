import { Models } from "@packages/nexus-api-contracts/models";
import {
  learningResourceRepositoryInstance,
  ExternalResourceRepository,
} from "./externalResource.repository.js";
import {
  tryCatch,
  rethrowServerError,
  tryCatchHandled,
} from "@/utils/tryCatch.util.js";
import { PostgrestError } from "@supabase/supabase-js";
import { ServerError } from "@/classes/ServerError.js";
import { Server } from "http";

export class ResourceService {
  constructor(
    private readonly resourceRepository: ExternalResourceRepository = learningResourceRepositoryInstance,
  ) {}

  create = async (
    dto: Omit<Models.resourceSystem.resource.insertDTO, "uploader_id">,
    uploaderId: string,
  ) => {
    const data = await tryCatchHandled(
      async () =>
        await this.resourceRepository.create({
          ...dto,
          uploader_id: uploaderId,
        }),
      {
        onServerError: rethrowServerError("creating external resource"),
        onUnknownError: (error) => {
          throw ServerError.internalError("Unknown error");
        }
      },
    );  

    return { data };
  };

  delete = async (resourceId: string) => {
    const { data, error } = await catchUnknownErrors(
      async () => await this.resourceRepository.delete(resourceId),
      "deleting external resource",
    );
    if (error) {
      return { error };
    }

    return { data };
  };

  update = async (
    resourceId: string,
    dto: Models.resourceSystem.resource.updateDTO,
  ) => {
    const { data, error } = await this.resourceRepository.update(
      resourceId,
      dto,
    );
    if (error) {
      return { error };
    }
    return { data };
  };

  list = async () => {
    const { data, error } = await this.resourceRepository.list();
    if (error) {
      return { error };
    }
    return { data };
  };

  getOne = async (resourceId: string) => {
    const { data, error } = await this.resourceRepository.getOne(resourceId);
    if (error) {
      return { error };
    }
    return { data };
  };
}

export const resourceServiceInstance = new ResourceService();
