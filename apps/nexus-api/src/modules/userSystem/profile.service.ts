import {
  ProfileRepository,
  profileRepositoryInstance,
} from "./profile.repository.js";
import { UserRepository, userRepositoryInstance } from "./user.repository.js";

export class ProfileService {
  constructor(
    private profileRespository: ProfileRepository = profileRepositoryInstance
  ) {}

  getUserProfileByUserId = async (userId: string) => {
    const { data, error } =
      await this.profileRespository.getProfileByUserId(userId);
    if (error) {
      return { error };
    }
    return { data };
  };
}


export const profileServiceInstance = new ProfileService();