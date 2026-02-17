/**
 * API function for fetching user profile data
 * 
 * This function calls the Nexus API to retrieve complete user information
 * including profile, social links, and activity data.
 */

import { UserAggregateResponse, UserProfile, UserProfileException } from '../types';

/**
 * Fetches user aggregate data from Nexus API
 * 
 * @param userId - The unique identifier for the user
 * @returns Promise<UserProfile> - The user's profile information
 * @throws {UserProfileException} - When the request fails or user is not found
 * 
 * @example
 * ```typescript
 * try {
 *   const profile = await getUserAggregate('user-123');
 *   console.log(profile.name, profile.role);
 * } catch (error) {
 *   if (error instanceof UserProfileException) {
 *     console.error('Profile error:', error.type);
 *   }
 * }
 * ```
 */
export async function getUserAggregate(userId: string): Promise<UserProfile> {
  // Validate the user ID before making the request
  if (!userId || userId.trim() === '') {
    throw new UserProfileException(
      'INVALID_USER_ID',
      'User ID is required and cannot be empty'
    );
  }

  // Get the base URL for the Nexus API (defaults to localhost:8000)
  const baseUrl = process.env.NEXT_PUBLIC_NEXUS_API_URL || 'http://localhost:8000/';
  
  // Construct the full API endpoint
  const url = `${baseUrl}api/user-system/users/${userId}/aggregate`;

  try {
    // Make the GET request to fetch user data
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Handle 404 - User Not Found
    if (response.status === 404) {
      throw new UserProfileException(
        'USER_NOT_FOUND',
        `User with ID "${userId}" was not found`
      );
    }

    // Handle other non-OK responses
    if (!response.ok) {
      throw new UserProfileException(
        'SERVER_ERROR',
        `Server responded with status ${response.status}`
      );
    }

    // Parse the JSON response
    const data: UserAggregateResponse = await response.json();

    // Extract the first profile from the profiles array
    // In the current API structure, user data is nested in profiles[0]
    const profileData = data.profiles?.[0];

    if (!profileData) {
      throw new UserProfileException(
        'USER_NOT_FOUND',
        'User profile data is missing from the response'
      );
    }

    // Transform the API response to our UserProfile interface
    // This converts snake_case to camelCase and structures the data
    const userProfile: UserProfile = {
      id: data.id,
      name: profileData.name,
      email: profileData.email,
      role: profileData.role,
      bio: profileData.bio,
      avatarUrl: profileData.avatar_url,
      portfolioUrl: profileData.portfolio_url,
      socialLinks: profileData.social_links,
      createdAt: profileData.created_at,
      updatedAt: profileData.updated_at,
    };

    return userProfile;
  } catch (error) {
    // If it's already a UserProfileException, re-throw it
    if (error instanceof UserProfileException) {
      throw error;
    }

    // Handle network errors (fetch failures, timeouts, etc.)
    if (error instanceof Error) {
      throw new UserProfileException(
        'NETWORK_ERROR',
        `Failed to fetch user profile: ${error.message}`
      );
    }

    // Handle unknown errors
    throw new UserProfileException(
      'SERVER_ERROR',
      'An unknown error occurred while fetching user profile'
    );
  }
}
