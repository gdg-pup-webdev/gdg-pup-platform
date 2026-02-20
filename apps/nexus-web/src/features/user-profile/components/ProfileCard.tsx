/**
 * Main Profile Card Component
 * 
 * This is the top-level component for displaying a user's profile.
 * It orchestrates all the smaller components and handles data fetching.
 * 
 * Features:
 * - Fetches user data using TanStack Query
 * - Shows loading state while fetching
 * - Shows error state if fetch fails
 * - Displays profile information with avatar, bio, social links
 * - Provides action buttons for interacting with the profile
 */

import React from 'react';
import { Card } from '@packages/spark-ui';
import { useUserProfile } from '../hooks/useUserProfile';
import { BackgroundGradients } from './BackgroundGradients';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { ProfileAvatar } from './ProfileAvatar';
import { ProfileHeader } from './ProfileHeader';
import { SocialLinks } from './SocialLinks';
import { ProfileActions } from './ProfileActions';

interface ProfileCardProps {
  // The ID of the user whose profile to display
  userId: string;
  
  // Whether to show action buttons (edit, share, etc.)
  showActions?: boolean;
  
  // Whether this is the current user's profile
  isOwnProfile?: boolean;
}

/**
 * Displays a complete user profile with all information and actions
 * 
 * @example
 * ```typescript
 * // In a Next.js page component
 * export default function ProfilePage({ params }: { params: { id: string } }) {
 *   return <ProfileCard userId={params.id} showActions isOwnProfile={false} />;
 * }
 * ```
 */
export function ProfileCard({ 
  userId, 
  showActions = true,
  isOwnProfile = false,
}: ProfileCardProps) {
  // Fetch the user profile data using our custom hook
  // This hook uses TanStack Query under the hood for caching and state management
  const { profile, isLoading, error, errorType, refetch } = useUserProfile(userId);

  // LOADING STATE
  // Show a loading screen while we fetch the user data
  if (isLoading) {
    return <LoadingState />;
  }

  // ERROR STATE
  // Show an error screen if something went wrong
  if (error || !profile) {
    return (
      <ErrorState 
        error={error || 'Profile data is missing'} 
        errorType={errorType}
        onRetry={refetch}
      />
    );
  }

  // SUCCESS STATE
  // Render the full profile page with all components
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background gradients */}
      <BackgroundGradients />

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Profile card with glass morphism effect */}
          <Card>
            <div className="p-8 md:p-12 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
              {/* Avatar with gradient border */}
              <ProfileAvatar 
                avatarUrl={profile.avatarUrl}
                name={profile.name}
              />

              {/* Name, role, and bio */}
              <ProfileHeader
                name={profile.name}
                role={profile.role}
                bio={profile.bio}
              />

              {/* Action buttons (if enabled) */}
              {showActions && (
                <ProfileActions
                  userId={userId}
                  isOwnProfile={isOwnProfile}
                />
              )}

              {/* Social media links and portfolio */}
              <SocialLinks
                links={profile.socialLinks}
                portfolioUrl={profile.portfolioUrl}
              />
            </div>
          </Card>

          {/* Additional profile sections can be added here */}
          {/* For example: Activity feed, recent events, badges, etc. */}
        </div>
      </div>
    </div>
  );
}
