/**
 * Type definitions for the User Profile feature
 * 
 * This feature displays user profile information including:
 * - Basic info (name, role, bio)
 * - Social media links
 * - Portfolio/external links
 * - Activity stats
 */

/**
 * Social media link with platform info
 */
export interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
}

/**
 * User profile data structure
 * This matches the structure returned from Nexus API's user aggregate endpoint
 */
export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  role?: string;
  bio?: string;
  avatarUrl?: string;
  portfolioUrl?: string;
  socialLinks?: SocialLink[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * The full aggregate response from Nexus API
 * Contains nested profile data that needs to be extracted
 */
export interface UserAggregateResponse {
  status: 'success' | 'error';
  data: {
    id: string;
    display_name?: string;
    email?: string;
    avatar_url?: string;
    profiles?: Array<{
      id: string;
      program?: string;
      year_level?: string;
      bio?: string;
      github_url?: string;
      linkedin_url?: string;
      portfolio_url?: string;
      created_at?: string;
      updated_at?: string;
    }>;
  };
  // Additional fields can be added as needed
}

/**
 * Error types specific to user profile operations
 */
export type UserProfileError = 
  | 'USER_NOT_FOUND'
  | 'NETWORK_ERROR'
  | 'INVALID_USER_ID'
  | 'SERVER_ERROR';

/**
 * Custom error class for user profile errors
 */
export class UserProfileException extends Error {
  constructor(
    public type: UserProfileError,
    message: string
  ) {
    super(message);
    this.name = 'UserProfileException';
  }
}
