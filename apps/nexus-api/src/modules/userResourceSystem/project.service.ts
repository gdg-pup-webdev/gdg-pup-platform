import { Mode } from "fs";
import {
  ProjectRepository,
  projectRepositoryInstance,
} from "./project.repository.js";
import { Models } from "@packages/nexus-api-contracts";

export class ProjectService {
  constructor(
    private projectRepository: ProjectRepository = projectRepositoryInstance
  ) {}

  listProjectsOfUser = async (userId: string) => {
    const { data, error } =
      await this.projectRepository.listProjectsOfUser(userId);
    if (error) {
      return { error };
    }
    return { data };
  };

  getOne = async (id: string) => {
    const { data, error } = await this.projectRepository.getOne(id);
    if (error) {
      return { error };
    }
    return { data };
  };


  create = async (
    dto: Omit<
      Models.userResourceSystem.project.insertDTO,
      "created_at" | "updated_at" | "id" | "user_id"
    >,
    userId: string
  ) => {
    const { data, error } = await this.projectRepository.create({
      ...dto,
      user_id: userId,
    });

    if (error) {
      return { error };
    }
    return { data: data as Models.userResourceSystem.project.row };
  };

  delete = async (id: string) => {
    const { data, error } = await this.projectRepository.delete(id);
    if (error) {
      return { error };
    }
    return { data };
  };

  update = async (
    id: string,
    dto: Models.userResourceSystem.project.updateDTO
  ) => {
    const { data, error } = await this.projectRepository.update(id, dto);
    if (error) {
      return { error };
    }
    return { data };
  };
}

export const projectServiceInstance = new ProjectService();
