import {
  ProjectRepository,
  projectRepositoryInstance,
} from "./project.repository.js";
import { models } from "@packages/nexus-api-contracts";

type projectInsertDTO = models.userResourceSystem.project.insertDTO;
type projectUpdateDTO = models.userResourceSystem.project.updateDTO;

export class ProjectService {
  constructor(
    private projectRepository: ProjectRepository = projectRepositoryInstance,
  ) {}

  listProjectsOfUser = async (userId: string) => {
    return await this.projectRepository.listProjectsOfUser(userId);
  };

  listProjects = async () => {
    return await this.projectRepository.listProjects();
  };

  getOneProject = async (id: string) => {
    return await this.projectRepository.getOneProject(id);
  };

  createProject = async (dto: projectInsertDTO) => {
    return await this.projectRepository.createProject(dto);
  };

  deleteProject = async (id: string) => {
    return await this.projectRepository.deleteProject(id);
  };

  updateProject = async (id: string, dto: projectUpdateDTO) => {
    return await this.projectRepository.updateProject(id, dto);
  };
}

export const projectServiceInstance = new ProjectService();
