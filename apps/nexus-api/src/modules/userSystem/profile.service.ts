import { tryCatch } from "@/utils/tryCatch.util.js";
import {
  ProfileRepository,
  profileRepositoryInstance,
} from "./profile.repository.js";
import { RepositoryError } from "@/classes/ServerError.js";

export class ProfileService {
  constructor(
    private profileRespository: ProfileRepository = profileRepositoryInstance,
  ) {}

  getUserProfileByUserId = async (userId: string) => {
    const { data, error } = await tryCatch(
      async () => await this.profileRespository.getProfileByUserId(userId),
      "getting user profile",
    );
    if (error) throw new RepositoryError(error.message);

    return data;
  };
}

export const profileServiceInstance = new ProfileService();
