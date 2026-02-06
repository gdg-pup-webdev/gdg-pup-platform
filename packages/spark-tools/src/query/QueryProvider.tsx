/**
 * Query Provider Component
 * 
 * Wraps the application with TanStack Query's QueryClientProvider.
 * This should be added near the root of your app.
 * 
 * @example
 * ```tsx
 * // In your root layout or _app file
 * import { QueryProvider } from '@packages/frontend-utils/query';
 * 
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <QueryProvider>
 *           {children}
 *         </QueryProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */

'use client';

import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, type ReactNode } from 'react';
import { createQueryClient } from './queryClient';

export interface QueryProviderProps {
  /** Child components */
  children: ReactNode;
  
  /** Custom QueryClient instance (optional) */
  client?: QueryClient;
  
  /** Show React Query Devtools (default: true in development) */
  showDevtools?: boolean;
}

/**
 * Provider component for TanStack Query
 * 
 * Automatically creates a QueryClient instance if not provided.
 * Includes React Query Devtools in development mode.
 */
export function QueryProvider({
  children,
  client,
  showDevtools = process.env.NODE_ENV === 'development',
}: QueryProviderProps) {
  // Create a stable QueryClient instance
  const [queryClient] = useState(() => client || createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {showDevtools && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
