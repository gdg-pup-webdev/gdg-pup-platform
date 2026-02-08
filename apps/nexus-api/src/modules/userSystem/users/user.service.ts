/**
 * @file user.service.ts
 * @description Service layer for the User System.
 * Orchestrates business logic, handles error mapping from the repository,
 * and provides a clean API for the controller.
 */

import { UserRepository, userRepositoryInstance } from "./user.repository.js";

/**
 * UserService
 * Provides high-level operations for user management and resource aggregation.
 */
export class UserService {
  /**
   * @param userRepository - Data access layer for users.
   */
  constructor(
    private readonly userRepository: UserRepository = userRepositoryInstance,
  ) {}

  /**
   * getUserById
   * Retrieves a user by their unique ID.
   * @param userId - The ID of the user.
   */
  getUserById = async (userId: string) => {
    return await this.userRepository.getUserById(userId);
  };

  /**
   * listUsers
   * Retrieves all users registered in the system.
   */
  listUsers = async () => {
    return await this.userRepository.listUsers();
  };

  /**
   * getUserAggregate
   * Fetches a user along with all their owned resources (wallets, profiles, achievements, etc.).
   * @param userId - The ID of the user to aggregate.
   */
  getUserAggregate = async (userId: string) => {
    return await this.userRepository.getUserAggregate(userId);
  };
}

/**
 * Exported singleton instance of UserService.
 */
export const userServiceInstance = new UserService();
