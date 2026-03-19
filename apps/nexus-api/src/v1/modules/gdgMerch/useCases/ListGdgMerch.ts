import { RepositoryResultList } from "@/v1/types/repository.types";
import { IGdgMerchRepository } from "../domain/IGdgMerchRepository";
import { GdgMerch } from "../domain/GdgMerch";

export class ListGdgMerch {
  constructor(private readonly repo: IGdgMerchRepository) {}

  async execute(pageNumber: number, pageSize: number): RepositoryResultList<GdgMerch> {
    return await this.repo.list(pageNumber, pageSize);
  }
}
