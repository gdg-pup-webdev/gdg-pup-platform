import { tryCatch } from "@/utils/tryCatch.util.js";
import {
  ProfileRepository,
  profileRepositoryInstance,
} from "./profile.repository.js";
import { RepositoryError } from "@/classes/ServerError.js";
import { models } from "@packages/nexus-api-contracts";

type profileInsertDTO = models.userSystem.profile.insertDTO;
type profileUpdateDTO = models.userSystem.profile.updateDTO;

/**
 * Service for managing user profiles.
 * This class encapsulates the business logic for user profiles,
 * interacting with the repository layer for data access.
 */
export class ProfileService {
  constructor(
    private readonly profileRepository: ProfileRepository = profileRepositoryInstance,
  ) {}

  /**
   * Gets the profile of a user by their user ID.
   * @returns The user's profile.
   * @throws {RepositoryError} If the repository operation fails.
   */
  getUserProfileByUserId = async (userId: string) => {
    const { data, error } = await tryCatch(
      async () => await this.profileRepository.getProfileByUserId(userId),
      "getting user profile",
    );
    if (error) throw new RepositoryError(error.message);

    return data;
  };

  /**
   * Lists profiles with pagination.
   * @returns A list of profiles and the total count.
   * @throws {RepositoryError} If the repository operation fails.
   */
  listProfilesPaginated = async (pageNumber: number, pageSize: number) => {
    const { data, error } = await tryCatch(
      async () =>
        await this.profileRepository.listProfilesPaginated(
          pageNumber,
          pageSize,
        ),
      "listing profiles",
    );
    if (error) throw new RepositoryError(error.message);

    return data;
  };

  /**
   * Creates a new profile.
   * @returns The created profile.
   * @throws {RepositoryError} If the repository operation fails.
   */
  createProfile = async (dto: profileInsertDTO) => {
    const { data, error } = await tryCatch(
      async () => await this.profileRepository.createProfile(dto),
      "creating profile",
    );
    if (error) throw new RepositoryError(error.message);

    return data;
  };

  /**
   * Updates a profile.
   * @returns The updated profile.
   * @throws {RepositoryError} If the repository operation fails.
   */
  updateProfile = async (id: string, dto: profileUpdateDTO) => {
    const { data, error } = await tryCatch(
      async () => await this.profileRepository.updateProfile(id, dto),
      "updating profile",
    );
    if (error) throw new RepositoryError(error.message);

    return data;
  };
}

export const profileServiceInstance = new ProfileService();
