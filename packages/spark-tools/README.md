# @packages/spark-tools

Shared frontend infrastructure for GDG PUP Platform applications.

## What's Inside

This package contains reusable frontend utilities that can be shared across multiple apps (nexus-web, storybook, etc.):

- **Error Handling** - Custom error classes and error processing utilities
- **Base Services** - Abstract base service class with retry logic and error handling
- **TanStack Query Integration** - Modern data fetching with automatic caching and background refetching
- **Utility Hooks** - Common hooks for pagination, debouncing, and local storage

## Installation

This is an internal workspace package. Add it to your app's dependencies:

```json
{
  "dependencies": {
    "@packages/spark-tools": "workspace:*"
  }
}
```

## Setup

### 1. Wrap your app with QueryProvider

```typescript
// app/layout.tsx or _app.tsx
import { QueryProvider } from '@packages/spark-tools/query';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
```

## Usage

### TanStack Query (Recommended)

The TanStack Query integration provides better caching, automatic refetching, and optimistic updates.

```typescript
import { 
  useQuery, 
  useMutation, 
  queryKeys,
  useQueryUtils 
} from '@packages/spark-tools/query';

// Fetch data with automatic caching
function UserProfile({ userId }) {
  const { data, loading, error } = useQuery({
    queryKey: queryKeys.users.detail(userId),
    queryFn: () => userService.getUser(userId),
  });

  if (loading) return <Skeleton />;
  if (error) return <ErrorMessage error={error} />;
  return <div>{data.name}</div>;
}

// Mutations with cache invalidation
function UpdateUserButton({ userId }) {
  const utils = useQueryUtils();
  
  const { mutate, loading } = useMutation({
    mutationFn: (data) => userService.updateUser(userId, data),
    onSuccess: () => {
      utils.invalidateUserDetail(userId);
      toast.success('Updated!');
    },
  });

  return (
    <button onClick={() => mutate({ name: 'New Name' })} disabled={loading}>
      Update
    </button>
  );
}
```

### Utility Hooks

Common hooks for pagination, debouncing, and local storage:

```typescript
import { 
  usePagination, 
  useDebounce, 
  useLocalStorage 
} from '@packages/spark-tools/hooks';

// Pagination
function UsersList() {
  const { page, pageSize, nextPage, prevPage, hasNextPage, hasPrevPage } = usePagination({
    initialPage: 1,
    initialPageSize: 10,
    totalItems: 100,
  });
  
  return (
    <div>
      <UserTable page={page} pageSize={pageSize} />
      <button onClick={prevPage} disabled={!hasPrevPage}>Previous</button>
      <button onClick={nextPage} disabled={!hasNextPage}>Next</button>
    </div>
  );
}

// Debounced search
function SearchInput() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  useEffect(() => {
    if (debouncedSearchTerm) {
      searchResults(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);
  
  return <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />;
}

// Persistent state
function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Toggle Theme ({theme})
    </button>
  );
}
```

### Prefetching

Prefetch data for better UX:

```typescript
import { usePrefetch, usePrefetchOnHover } from '@packages/spark-tools/query';

// Manual prefetch
function UserLink({ userId }) {
  const { prefetch } = usePrefetch();
  
  return (
    <Link
      href={`/users/${userId}`}
      onMouseEnter={() => prefetch(
        queryKeys.users.detail(userId),
        () => userService.getUser(userId)
      )}
    >
      View Profile
    </Link>
  );
}

// Automatic prefetch on hover
function UserLinkAuto({ userId }) {
  const prefetchProps = usePrefetchOnHover(
    queryKeys.users.detail(userId),
    () => userService.getUser(userId)
  );
  
  return (
    <Link {...prefetchProps} href={`/users/${userId}`}>
      View Profile
    </Link>
  );
}
```

### Query Keys

Centralized query key management for consistent caching:

```typescript
import { queryKeys } from '@packages/spark-tools/query';

// Users
queryKeys.users.all           // ['users']
queryKeys.users.list()        // ['users', 'list']
queryKeys.users.detail(id)    // ['users', 'detail', id]

// Events
queryKeys.events.list({ status: 'active' })  // ['events', 'list', { status: 'active' }]
queryKeys.events.attendees(id)               // ['events', 'detail', id, 'attendees']

// Custom query keys
import { createQueryKeys } from '@packages/frontend-utils/query';

const customKeys = createQueryKeys('feature', {
  item: (id: string) => [id] as const,
});
```

### Error Handling

```typescript
import { ApiError, ValidationError, processError } from '@packages/frontend-utils/errors';

try {
  await someApiCall();
} catch (error) {
  const processedError = processError(error);
  console.error(processedError.message);
}
```

### Base Service

```typescript
import { BaseApiService } from '@packages/frontend-utils/services';
import { callEndpoint } from '@packages/typed-rest';

class UserService extends BaseApiService {
  async getUsers() {
    return this.get(apiContract.users.getAll, {});
  }
  
  async createUser(data) {
    return this.post(apiContract.users.create, data);
  }
}
```

### Legacy Hooks (Still Supported)

The old hooks are still available for backwards compatibility:

```typescript
import { useApiQuery, useApiMutation, usePagination } from '@packages/frontend-utils/hooks';

// Data fetching
const { data, loading, error } = useApiQuery(
  () => userService.getUsers(),
  []
);

// Mutations
const { mutate, loading } = useApiMutation(
  (userId) => userService.deleteUser(userId)
);

// Pagination
const { page, pageSize, setPage } = usePagination();
```

## Advanced Features

### Optimistic Updates

```typescript
const { mutate } = useApiMutation({
  mutationFn: (data) => userService.updateUser(userId, data),
  onMutate: async (newData) => {
    await queryClient.cancelQueries(queryKeys.users.detail(userId));
    const previous = queryClient.getQueryData(queryKeys.users.detail(userId));
    queryClient.setQueryData(queryKeys.users.detail(userId), newData);
    return { previous };
  },
  onError: (err, newData, context) => {
    queryClient.setQueryData(queryKeys.users.detail(userId), context?.previous);
  },
});
```

### Prefetching

```typescript
import { usePrefetch } from '@packages/frontend-utils/query';

function UserLink({ userId }) {
  const { prefetch } = usePrefetch();
  
  return (
    <Link 
      href={`/users/${userId}`}
      onMouseEnter={() => prefetch(
        queryKeys.users.detail(userId),
        () => userService.getUser(userId)
      )}
    >
      View User
    </Link>
  );
}
```

## Testing

Run tests:
```bash
pnpm test
```

Run tests in watch mode:
```bash
pnpm test:watch
```

## Architecture

This package follows the principle of shared infrastructure extraction:
- Code that's reusable across multiple apps lives here
- App-specific code stays in the respective app directories
- Clean separation of concerns for better maintainability
