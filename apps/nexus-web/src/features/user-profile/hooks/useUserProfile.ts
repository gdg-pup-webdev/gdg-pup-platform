/**
 * Custom hook for fetching and managing user profile data
 *
 * This hook uses TanStack Query (React Query) to handle:
 * - Data fetching from the Nexus API
 * - Loading states
 * - Error handling
 * - Automatic caching and refetching
 *
 * @see https://tanstack.com/query/latest for TanStack Query docs
 */

import { useQuery } from "@tanstack/react-query";
import { getUserAggregate } from "../api/getUserAggregate";
import { UserProfile, UserProfileException } from "../types";

/**
 * Hook return type with all the data and states you need
 */
interface UseUserProfileReturn {
  // The user profile data (null if loading or error)
  profile: UserProfile | null;

  // Loading state (true while fetching data)
  isLoading: boolean;

  // Error message (null if no error)
  error: string | null;

  // Error type for more specific error handling
  errorType: UserProfileException["type"] | null;

  // Function to manually refetch the data
  refetch: () => void;
}

/**
 * Custom hook to fetch user profile data
 *
 * @param userId - The ID of the user to fetch
 * @returns UseUserProfileReturn - Profile data, loading state, and error info
 *
 * @example
 * ```typescript
 * function ProfilePage({ userId }: { userId: string }) {
 *   const { profile, isLoading, error, refetch } = useUserProfile(userId);
 *
 *   if (isLoading) return <LoadingSpinner />;
 *   if (error) return <ErrorMessage message={error} onRetry={refetch} />;
 *   if (!profile) return <NotFound />;
 *
 *   return (
 *     <div>
 *       <h1>{profile.name}</h1>
 *       <p>{profile.bio}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useUserProfile(userId: string): UseUserProfileReturn {
  // Use TanStack Query's useQuery hook to manage the async data fetching
  const {
    data, // The fetched profile data (undefined until loaded)
    isLoading, // True while the query is running
    error, // The error object if the query failed
    refetch, // Function to manually trigger a refetch
  } = useQuery({
    // Unique key for this query - used for caching
    // The key includes the userId so each user's data is cached separately
    queryKey: ["user-profile", userId],

    // The function that actually fetches the data
    queryFn: () => getUserAggregate(userId),

    // Only run the query if we have a valid userId
    enabled: Boolean(userId),

    // How long to consider the data "fresh" (5 minutes)
    // During this time, React Query won't refetch even if the component remounts
    staleTime: 5 * 60 * 1000,

    // How long to keep unused data in cache (10 minutes)
    gcTime: 10 * 60 * 1000,

    // Retry failed requests up to 2 times
    retry: 2,

    // Wait 1 second before retrying
    retryDelay: 1000,
  });

  // Extract error information if the query failed
  let errorMessage: string | null = null;
  let errorType: UserProfileException["type"] | null = null;

  if (error) {
    if (error instanceof UserProfileException) {
      // If it's our custom error, use the typed error info
      errorMessage = error.message;
      errorType = error.type;
    } else if (error instanceof Error) {
      // If it's a generic error, use its message
      errorMessage = error.message;
      errorType = "SERVER_ERROR";
    } else {
      // Fallback for unknown error types
      errorMessage = "An unknown error occurred";
      errorType = "SERVER_ERROR";
    }
  }

  // Return a clean object with all the info the component needs
  return {
    profile: data || null,
    isLoading,
    error: errorMessage,
    errorType,
    refetch,
  };
}
