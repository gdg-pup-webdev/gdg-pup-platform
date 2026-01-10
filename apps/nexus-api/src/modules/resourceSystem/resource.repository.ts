import { Models } from "@packages/nexus-api-contracts";

export class ResourceResponsitory {
  constructor() {}

  create(dto: Models.resourceSystem.resource.row) {
    return {
      data: dto,
    };
  }
}
