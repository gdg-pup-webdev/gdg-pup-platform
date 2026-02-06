/**
 * Query Key Factory
 * 
 * Centralized query key management for consistent caching and invalidation.
 * Following TanStack Query best practices for query key organization.
 * 
 * @example
 * ```typescript
 * // In a service or hook
 * const queryKey = queryKeys.users.detail(userId);
 * const queryKey = queryKeys.events.list({ page: 1, status: 'active' });
 * ```
 */

export const queryKeys = {
  // Users
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters?: Record<string, any>) => 
      [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
    profile: (id: string) => [...queryKeys.users.detail(id), 'profile'] as const,
  },
  
  // Events
  events: {
    all: ['events'] as const,
    lists: () => [...queryKeys.events.all, 'list'] as const,
    list: (filters?: Record<string, any>) => 
      [...queryKeys.events.lists(), filters] as const,
    details: () => [...queryKeys.events.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.events.details(), id] as const,
    attendees: (id: string) => 
      [...queryKeys.events.detail(id), 'attendees'] as const,
  },
  
  // Teams
  teams: {
    all: ['teams'] as const,
    lists: () => [...queryKeys.teams.all, 'list'] as const,
    list: (filters?: Record<string, any>) => 
      [...queryKeys.teams.lists(), filters] as const,
    details: () => [...queryKeys.teams.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.teams.details(), id] as const,
    members: (id: string) => [...queryKeys.teams.detail(id), 'members'] as const,
  },
  
  // Resources
  resources: {
    all: ['resources'] as const,
    lists: () => [...queryKeys.resources.all, 'list'] as const,
    list: (filters?: Record<string, any>) => 
      [...queryKeys.resources.lists(), filters] as const,
    details: () => [...queryKeys.resources.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.resources.details(), id] as const,
  },
  
  // Auth
  auth: {
    all: ['auth'] as const,
    session: () => [...queryKeys.auth.all, 'session'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
  },
} as const;

/**
 * Helper to create custom query keys for feature-specific queries
 * 
 * @example
 * ```typescript
 * const customKeys = createQueryKeys('customFeature', {
 *   item: (id: string) => [id] as const,
 *   list: (filters?: any) => [filters] as const,
 * });
 * 
 * // Usage: customKeys.item('123') => ['customFeature', '123']
 * ```
 */
export function createQueryKeys<
  T extends Record<string, (...args: any[]) => readonly any[]>
>(feature: string, keys: T) {
  const result: any = { all: [feature] as const };
  
  for (const [key, factory] of Object.entries(keys)) {
    result[key] = (...args: any[]) => [feature, ...factory(...args)];
  }
  
  return result as { all: readonly [string] } & {
    [K in keyof T]: (...args: Parameters<T[K]>) => readonly [string, ...ReturnType<T[K]>]
  };
}
