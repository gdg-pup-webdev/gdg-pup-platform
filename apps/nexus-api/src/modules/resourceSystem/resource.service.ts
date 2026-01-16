import { Models } from "@packages/nexus-api-contracts/models";
import {
  resourceReponsitoryInstance,
  ResourceResponsitory,
} from "./resource.repository.js";

export class ResourceService {
  constructor(
    private readonly resourceRepository: ResourceResponsitory = resourceReponsitoryInstance
  ) {}

  create = async (dto: Omit<Models.resourceSystem.resource.insertDTO, "uploader_id">, uploaderId: string) => {
    const { data, error } = await this.resourceRepository.create({ ...dto, uploader_id: uploaderId });
    if (error) {
      return { error };
    }
    return { data };
  };

  delete = async (resourceId: string) => {
    const { data, error } = await this.resourceRepository.delete(resourceId);
    if (error) {
      return { error };
    }
    return { data };
  };

  update = async (
    resourceId: string,
    dto: Models.resourceSystem.resource.updateDTO
  ) => {
    const { data, error } = await this.resourceRepository.update(
      resourceId,
      dto
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
