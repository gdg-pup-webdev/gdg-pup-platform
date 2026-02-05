# @packages/frontend-utils

Shared frontend infrastructure for GDG PUP Platform applications.

## What's Inside

This package contains reusable frontend utilities that can be shared across multiple apps (nexus-web, storybook, etc.):

- **Error Handling** - Custom error classes and error processing utilities
- **Base Services** - Abstract base service class with retry logic and error handling
- **React Hooks** - Common hooks for data fetching, mutations, pagination, and debouncing

## Installation

This is an internal workspace package. Add it to your app's dependencies:

```json
{
  "dependencies": {
    "@packages/frontend-utils": "workspace:*"
  }
}
```

## Usage

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
    return this.executeWithRetry(() =>
      callEndpoint(apiContract.users.getAll, {})
    );
  }
}
```

### Hooks

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
const { page, pageSize, setPage, setPageSize } = usePagination();
```

## Architecture

This package follows the principle of shared infrastructure extraction:
- Code that's reusable across multiple apps lives here
- App-specific code stays in the respective app directories
- Clean separation of concerns for better maintainability

## Testing

Run tests:
```bash
pnpm test
```

Run tests in watch mode:
```bash
pnpm test:watch
```
