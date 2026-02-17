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

    // Check if the response has the expected structure
    if (!data || data.status !== 'success' || !data.data) {
      throw new UserProfileException(
        'SERVER_ERROR',
        'Invalid response structure from server'
      );
    }

    // Extract the actual user data from the response
    const userData = data.data;

    // Extract the first profile from the profiles array
    // In the current API structure, user data is nested in profiles[0]
    const profileData = userData.profiles?.[0];

    if (!profileData) {
      throw new UserProfileException(
        'USER_NOT_FOUND',
        'User profile data is missing from the response'
      );
    }

    // Build social links array from individual URL fields
    const socialLinks: { platform: string; url: string }[] = [];
    if (profileData.github_url) {
      socialLinks.push({ platform: 'GitHub', url: profileData.github_url });
    }
    if (profileData.linkedin_url) {
      socialLinks.push({ platform: 'LinkedIn', url: profileData.linkedin_url });
    }

    // Build role from program and year_level
    let role = 'Member';
    if (profileData.program && profileData.year_level) {
      role = `${profileData.program} - Year ${profileData.year_level}`;
    } else if (profileData.program) {
      role = profileData.program;
    }

    // Transform the API response to our UserProfile interface
    // This converts the actual API structure to our internal format
    const userProfile: UserProfile = {
      id: userData.id,
      name: userData.display_name || 'GDG Member',
      email: userData.email,
      role: role,
      bio: profileData.bio || 'No bio available.',
      avatarUrl: userData.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.id}`,
      portfolioUrl: profileData.portfolio_url,
      socialLinks: socialLinks,
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
