import { tryCatch_deprecated } from "@/utils/tryCatch.util.js";
import {
  ProfileRepository,
  profileRepositoryInstance,
} from "./profile.repository.js";
import { RepositoryError_DEPRECATED } from "@/classes/ServerError.js";
import { models } from "@packages/nexus-api-contracts";

type profileInsertDTO = models.userSystem.profile.insertDTO;
type profileUpdateDTO = models.userSystem.profile.updateDTO;

export class ProfileService {
  constructor(
    private readonly profileRespository: ProfileRepository = profileRepositoryInstance,
  ) {}

  getUserProfileByUserId = async (userId: string) => {
    const { data, error } = await tryCatch_deprecated(
      async () => await this.profileRespository.getProfileByUserId(userId),
      "getting user profile",
    );
    if (error) throw new RepositoryError_DEPRECATED(error.message);

    return data;
  };

  listProfilesPaginated = async (pageNumber: number, pageSize: number) => {
    const { data, error } = await tryCatch_deprecated(
      async () =>
        await this.profileRespository.listProfilesPaginated(
          pageNumber,
          pageSize,
        ),
      "listing profiles",
    );
    if (error) throw new RepositoryError_DEPRECATED(error.message);

    return data;
  };

  createProfile = async (dto: profileInsertDTO) => {
    const { data, error } = await tryCatch_deprecated(
      async () => await this.profileRespository.createProfile(dto),
      "creating profile",
    );
    if (error) throw new RepositoryError_DEPRECATED(error.message);

    return data;
  };

  updateProfile = async (id: string, dto: profileUpdateDTO) => {
    const { data, error } = await tryCatch_deprecated(
      async () => await this.profileRespository.updateProfile(id, dto),
      "updating profile",
    );
    if (error) throw new RepositoryError_DEPRECATED(error.message);

    return data;
  };
}

export const profileServiceInstance = new ProfileService();
