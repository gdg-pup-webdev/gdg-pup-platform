**[⬅️ Previous: Error Handling](./5-ErrorHandling.md)** | **[Back to Onboarding](./README.md)** | **[Next: Development Workflow ➡️](./7-DevelopmentWorkflow.md)**

---

# Frontend Development

This guide provides an overview of the frontend architecture for the `nexus-web` application, including the project structure and how to interact with the backend using our type-safe API client.

## Frontend Architecture

The `nexus-web` application is built with Next.js using the App Router and follows a **feature-based architecture**. Data fetching is handled by **TanStack Query** for optimal caching, synchronization, and server state management.

```
apps/nexus-web/src/
├── app/
│   ├── layout.tsx              # Root application layout
│   ├── page.tsx                # Homepage
│   ├── events/
│   │   └── page.tsx            # Events page
│   ├── activate/
│   │   └── page.tsx            # Card activation page
│   └── profile/
│       └── page.tsx            # User profile page
│
├── features/                   # Feature modules (self-contained)
│   ├── health-checks/
│   │   ├── api/                # API functions
│   │   ├── components/         # Feature-specific components
│   │   ├── hooks/              # Feature-specific hooks (TanStack Query)
│   │   ├── index.ts            # Barrel export
│   │   └── types.ts            # TypeScript types
│   ├── card-activation/
│   ├── events/
│   └── user-profile/
│
├── components/
│   ├── ui/                     # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Input.tsx
│   └── shared/                 # Shared layout components
│       ├── Navbar.tsx
│       ├── Footer.tsx
│       └── PageLayout.tsx
│
├── providers/                  # Global context providers (e.g., Auth, Theme)
│   └── AuthProvider.tsx
│
├── lib/                        # Core utilities and configurations
│   └── supabase.ts             # Supabase client setup
│
├── configs/                    # Configuration files
│   └── servers.config.ts
│
└── utils/                      # Utility functions
    └── utils.ts
```

### Directory Responsibilities

- **`app/`**: Next.js App Router for file-based routing and server components
- **`features/`**: Self-contained feature modules with their own API, components, hooks, and types
- **`components/ui/`**: Reusable UI components built with or composed from Spark-UI
- **`components/shared/`**: Shared layout and structural components (Navbar, Footer, etc.)
- **`providers/`**: React context providers that wrap the entire application
- **`lib/`**: Core utilities and third-party service configurations
- **`configs/`**: Application configuration files
- **`utils/`**: General-purpose utility functions

### Internal UI Library (SparkUI)

We use **SparkUI**, our internal component library and design system, for all shared UI across frontend applications.

Spark-UI provides reusable, brand-level components and defines visual behavior, accessibility, and theming. Application code should **compose SparkUI components**, not reimplement them. Feature-specific UI is built within feature modules under `features/` by composing SparkUI primitives.

All Spark-UI components are **documented and visually tested in Storybook**, which serves as the source of truth for component usage, appearance, and supported variants.

Before building new UI components in the application, always consult:

- **SparkUI source & documentation:** [SparkUI/README.md](../SparkUI/README.md)
- **Component usage & visual reference:** Storybook (`apps/storybook`)

For detailed ownership rules and contribution guidelines, see: [SparkUI Documentation](../SparkUI/README.md)

## Type-Safe API Client with TanStack Query

We combine two powerful tools for data fetching:

1. **`@packages/typed-rest`** – Provides end-to-end type safety from API contracts
2. **TanStack Query** – Manages caching, synchronization, and server state

The `callEndpoint` function from `@packages/typed-rest` makes fully typed API requests based on contract definitions. When wrapped in TanStack Query hooks, you get automatic caching, background refetching, optimistic updates, and more.

### Basic Pattern: API Function + Hook

The standard pattern is to create an API function using `callEndpoint`, then wrap it in a TanStack Query hook:

**Step 1: Create the API function**

```typescript
// src/features/user-profile/api/getUserProfile.ts
import { callEndpoint } from "@packages/typed-rest";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/configs/servers.config";

export async function getUserProfile(userId: string) {
  const result = await callEndpoint(
    configs.nexusApi.baseUrl,
    contract.api.users.userId.GET,
    { params: { userId } },
  );

  // The 'result' object is fully typed based on the contract
  if (result.status === 200) {
    return result.body.data;
  }

  throw new Error(result.body.message);
}
```

**Step 2: Create a TanStack Query hook**

```typescript
// src/features/user-profile/hooks/useUserProfile.ts
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../api";

export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: ["user-profile", userId],
    queryFn: () => getUserProfile(userId),
    enabled: !!userId, // Only run if userId exists
  });
}
```

**Step 3: Use in a component**

```typescript
// src/app/profile/[userId]/page.tsx
'use client';

import { useUserProfile } from '@/features/user-profile';
import { LoadingScreen } from '@/components/shared';

export default function ProfilePage({ params }: { params: { userId: string } }) {
  const { data: profile, isLoading, error } = useUserProfile(params.userId);

  if (isLoading) return <LoadingScreen />;
  if (error) return <div>Error loading profile</div>;
  if (!profile) return null;

  return (
    <div>
      <h1>{profile.name}</h1>
      <p>{profile.email}</p>
    </div>
  );
}
```

### Benefits of This Approach

- ✅ **Type Safety**: Full TypeScript support from API contract to UI
- ✅ **Automatic Caching**: No duplicate requests for the same data
- ✅ **Loading States**: Built-in loading, error, and success states
- ✅ **Background Refetching**: Keeps data fresh automatically
- ✅ **Optimistic Updates**: Update UI before server responds
- ✅ **Request Deduplication**: Multiple components requesting same data = one network call

For more advanced patterns (mutations, pagination, infinite queries), see the [TanStack Query Guide](../TANSTACK_QUERY_GUIDE.md).

---

## Feature-Based Architecture

The `nexus-web` application follows a **feature-based architecture**, where related functionality is organized into self-contained feature modules. This approach promotes:

- **Better code organization** – All related code lives together
- **Improved maintainability** – Easy to locate and modify feature-specific code
- **Scalability** – New features can be added without affecting existing ones
- **Reusability** – Features can be easily shared or moved between applications

### Feature Structure

Each feature is a self-contained module under `src/features/` with the following structure:

```
src/features/<feature-name>/
├── api/
│   └── index.ts                 # Barrel export for all API functions
├── components/
│   └── index.ts                 # Barrel export for all components
├── hooks/
│   └── index.ts                 # Barrel export for all hooks
├── index.ts                     # Main barrel export for entire feature
└── types.ts                     # TypeScript types/interfaces
```

**Directory Responsibilities:**

- **`api/`**: Contains all API-related functions (fetching, mutations, queries)
- **`components/`**: Feature-specific React components
- **`hooks/`**: Custom React hooks for feature logic
- **`types.ts`**: TypeScript interfaces and types for the feature
- **`index.ts`**: Barrel exports to provide a clean public API

### Feature Generator

To ensure consistency across features, we provide a built-in CLI tool that generates new feature modules automatically.

#### Usage

```bash
pnpm run g <feature-name>
```

**Example:**

```bash
pnpm run g user-profile
```

This creates `src/features/user-profile/` with the complete folder structure and template files.

#### Naming Rules

Feature names **must be in kebab-case** (lowercase with hyphens):

- ✅ **Valid**: `user`, `user-profile`, `card-activation`, `event-gallery`
- ❌ **Invalid**: `UserProfile`, `user_profile`, `123user`

#### Generated Files

The generator creates template files with helpful examples:

1. **`types.ts`** – Contains example interfaces to get you started
2. **`api/index.ts`** – Ready for API function exports
3. **`components/index.ts`** – Ready for component exports
4. **`hooks/index.ts`** – Ready for custom hook exports
5. **`index.ts`** – Main barrel export for the entire feature

#### Next Steps After Generation

After generating a feature, follow these steps to implement it:

1. **Define Types** – Add your TypeScript types/interfaces to `types.ts`
2. **Create Components** – Build React components in `components/`
3. **Create Hooks** – Add custom hooks in `hooks/`
4. **Create API Functions** – Implement API calls in `api/`
5. **Export Everything** – Update `index.ts` files to export your code

#### Using Generated Features

Import from the feature module using clean, absolute imports:

```typescript
import { UserProfileCard, useUserProfile } from "@/features/user-profile";
```

This approach keeps imports clean and makes it easy to refactor feature internals without affecting consumers.

#### Example: Complete Feature Implementation

Here's an example of a fully implemented `user-profile` feature:

```typescript
// src/features/user-profile/types.ts
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

// src/features/user-profile/api/getUserProfile.ts
import { callEndpoint } from '@packages/typed-rest';
import { contract } from '@packages/nexus-api-contracts';
import { configs } from '@/configs/servers.config';
import type { UserProfile } from '../types';

export async function getUserProfile(userId: string): Promise<UserProfile> {
  const result = await callEndpoint(
    configs.nexusApi.baseUrl,
    contract.api.users.userId.GET,
    { params: { userId } }
  );

  if (result.status === 200) {
    return result.body.data;
  }

  throw new Error(result.body.message);
}

// src/features/user-profile/api/index.ts
export { getUserProfile } from './getUserProfile';

// src/features/user-profile/hooks/useUserProfile.ts
import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '../api';

export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: ['user-profile', userId],
    queryFn: () => getUserProfile(userId),
  });
}

// src/features/user-profile/hooks/index.ts
export { useUserProfile } from './useUserProfile';

// src/features/user-profile/components/UserProfileCard.tsx
import { Card, Avatar, Text } from '@packages/spark-ui';
import type { UserProfile } from '../types';

export function UserProfileCard({ profile }: { profile: UserProfile }) {
  return (
    <Card>
      <Avatar src={profile.avatarUrl} alt={profile.name} />
      <Text variant="h3">{profile.name}</Text>
      <Text variant="body">{profile.email}</Text>
    </Card>
  );
}

// src/features/user-profile/components/index.ts
export { UserProfileCard } from './UserProfileCard';

// src/features/user-profile/index.ts
export * from './types';
export * from './api';
export * from './hooks';
export * from './components';
```

Then use it in a page:

```typescript
// src/app/users/[userId]/page.tsx
'use client';

import { UserProfileCard, useUserProfile } from '@/features/user-profile';

export default function UserPage({ params }: { params: { userId: string } }) {
  const { data: profile, isLoading, error } = useUserProfile(params.userId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading profile</div>;
  if (!profile) return null;

  return <UserProfileCard profile={profile} />;
}
```

---

**[⬅️ Previous: Error Handling](./5-ErrorHandling.md)** | **[Back to Onboarding](./README.md)** | **[Next: Development Workflow ➡️](./7-DevelopmentWorkflow.md)**
