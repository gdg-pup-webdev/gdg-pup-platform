/**
 * Profile avatar component with gradient border
 * 
 * Displays the user's avatar with an animated gradient border effect.
 * Falls back to initials if no avatar URL is provided.
 */

import React from 'react';
import { Avatar } from '@/components/ui/Avatar';

interface ProfileAvatarProps {
  // URL of the user's avatar image
  avatarUrl?: string;
  
  // User's display name (used for initials fallback)
  name: string;
}

/**
 * Renders a large avatar with animated gradient border
 */
export function ProfileAvatar({ avatarUrl, name }: ProfileAvatarProps) {
  return (
    <div className="flex justify-center mb-8">
      {/* Animated gradient border container */}
      <div className="relative">
        {/* Gradient border with animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full animate-spin-slow blur-sm" />
        
        {/* Avatar container with white bg to create border effect */}
        <div className="relative bg-slate-900 rounded-full p-2">
          <Avatar 
            src={avatarUrl} 
            alt={name}
            size="xl" 
          />
        </div>
      </div>
    </div>
  );
}
