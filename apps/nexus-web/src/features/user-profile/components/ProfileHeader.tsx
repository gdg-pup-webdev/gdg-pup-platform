/**
 * Profile header component
 * 
 * Displays the user's name, role, and bio.
 * This is the main identifying information for the profile.
 */

import React from 'react';
import { Badge } from '@/components/ui/Badge';

interface ProfileHeaderProps {
  // User's display name
  name: string;
  
  // User's role or title (e.g., "Developer", "Designer")
  role?: string;
  
  // User's biography or description
  bio?: string;
}

/**
 * Renders the main profile information (name, role, bio)
 */
export function ProfileHeader({ name, role, bio }: ProfileHeaderProps) {
  return (
    <div className="text-center space-y-4 mb-8">
      {/* User's name */}
      <h1 className="text-5xl font-bold text-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
        {name}
      </h1>

      {/* User's role (if provided) */}
      {role && (
        <div className="flex justify-center">
          <Badge variant="info" size="md">
            {role}
          </Badge>
        </div>
      )}

      {/* User's bio (if provided) */}
      {bio && (
        <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
          {bio}
        </p>
      )}
    </div>
  );
}
