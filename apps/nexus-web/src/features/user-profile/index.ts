/**
 * Barrel export for user-profile feature
 * 
 * This allows easy importing of the entire feature:
 * import { ProfileCard, useUserProfile } from '@/features/user-profile';
 */

// Components
export * from './components';

// Hooks
export { useUserProfile } from './hooks/useUserProfile';

// API functions
export { getUserAggregate } from './api/getUserAggregate';

// Types
export * from './types';
