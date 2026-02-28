import { TablesInsert, TablesUpdate } from "@/v0/types/supabase.types.js";
import {
  ProfileRepository,
  profileRepositoryInstance,
} from "./profile.repository.js";
import { models } from "@packages/nexus-api-contracts";

type profileInsertDTO = TablesInsert<"user_profile">;
type profileUpdateDTO = TablesUpdate<"user_profile">;

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
    return await this.profileRepository.getProfileByUserId(userId);
  };

  /**
   * Lists profiles with pagination.
   * @returns A list of profiles and the total count.
   * @throws {RepositoryError} If the repository operation fails.
   */
  listProfilesPaginated = async (pageNumber: number, pageSize: number) => {
    return await this.profileRepository.listProfilesPaginated(
      pageNumber,
      pageSize,
    );
  };

  /**
   * Creates a new profile.
   * @returns The created profile.
   * @throws {RepositoryError} If the repository operation fails.
   */
  createProfile = async (dto: profileInsertDTO) => {
    return await this.profileRepository.createProfile(dto);
  };

  /**
   * Updates a profile.
   * @returns The updated profile.
   * @throws {RepositoryError} If the repository operation fails.
   */
  updateProfile = async (id: string, dto: profileUpdateDTO) => {
    return await this.profileRepository.updateProfile(id, dto);
  };
}

export const profileServiceInstance = new ProfileService();
