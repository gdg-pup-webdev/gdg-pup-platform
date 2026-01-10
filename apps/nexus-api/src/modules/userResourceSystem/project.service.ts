import {
  ProjectRepository,
  projectRepositoryInstance,
} from "./project.repository.js";

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
}


export const projectServiceInstance = new ProjectService();