import {
  ProjectRepository,
  projectRepositoryInstance,
} from "./project.repository.js";
import { tryCatch } from "@/utils/tryCatch.util.js";
import { RepositoryError } from "@/classes/ServerError.js";
import { models } from "@packages/nexus-api-contracts";

type projectInsertDTO = models.userResourceSystem.project.insertDTO;
type projectUpdateDTO = models.userResourceSystem.project.updateDTO;

export class ProjectService {
  constructor(
    private projectRepository: ProjectRepository = projectRepositoryInstance,
  ) {}

  listProjectsOfUser = async (userId: string) => {
    const { data, error } = await tryCatch(
      async () => await this.projectRepository.listProjectsOfUser(userId),
      "listing projects",
    );
    if (error) throw new RepositoryError(error.message);
    return data;
  };

  listProjects = async () => {
    const { data, error } = await tryCatch(
      async () => await this.projectRepository.listProjects(),
      "listing projects",
    );
    if (error) throw new RepositoryError(error.message);
    return data;
  };

  getOneProject = async (id: string) => {
    const { data, error } = await tryCatch(
      async () => await this.projectRepository.getOneProject(id),
      "getting project",
    );
    if (error) throw new RepositoryError(error.message);
    return data;
  };

  createProject = async (dto: projectInsertDTO) => {
    const { data, error } = await tryCatch(
      async () =>
        await this.projectRepository.createProject(dto),
      "creating project",
    );

    if (error) throw new RepositoryError(error.message);
    return data;
  };

  deleteProject = async (id: string) => {
    const { data, error } = await tryCatch(
      async () => await this.projectRepository.deleteProject(id),
      "deleting project",
    );

    if (error) throw new RepositoryError(error.message);
    return data;
  };

  updateProject = async (id: string, dto: projectUpdateDTO) => {
    const { data, error } = await tryCatch(
      async () => await this.projectRepository.updateProject(id, dto),
      "updating project",
    );
    if (error) throw new RepositoryError(error.message);
    return data;
  };
}

export const projectServiceInstance = new ProjectService();
