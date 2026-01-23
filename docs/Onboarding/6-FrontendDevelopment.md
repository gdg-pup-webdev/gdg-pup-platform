**[⬅️ Previous: Error Handling](./5-ErrorHandling.md)** | **[Back to Onboarding](./README.md)** | **[Next: Development Workflow ➡️](./7-DevelopmentWorkflow.md)**

---

# Frontend Development

This guide provides an overview of the frontend architecture for the `nexus-web` application, including the project structure and how to interact with the backend using our type-safe API client.

## Frontend Architecture

The `nexus-web` application is built with Next.js and uses the App Router. The project is structured to promote separation of concerns and maintainability.

```
apps/nexus-web/src/
├── app/
│   ├── layout.tsx              # Root application layout
│   ├── page.tsx                # Homepage
│   ├── events/
│   │   ├── page.tsx            # Events list page
│   │   └── [eventId]/
│   │       └── page.tsx        # Event detail page
│   └── users/
│       └── [userId]/
│           └── page.tsx        # User profile page
│
├── components/
│   ├── ui/                     # Core UI components from shadcn/ui
│   │   ├── button.tsx
│   │   └── card.tsx
│   └── features/               # Components specific to application features
│       ├── EventCard.tsx
│       └── UserProfile.tsx
│
├── lib/
│   ├── api.ts                  # Type-safe API client setup
│   └── utils.ts                # General utility functions
│
├── providers/                  # Global context providers (e.g., Auth, Theme)
│
└── hooks/
    ├── useAuth.ts              # Hook for authentication logic
    └── useApi.ts               # Hook for simplified API calls
```

-   **`app/`**: Follows the Next.js App Router conventions for file-based routing.
-   **`components/`**: Contains all React components, separated into `ui` for generic, reusable elements and `features` for components tied to specific application functionality.
-   **`lib/`**: Includes core utilities, most notably the configuration for our type-safe API client.
-   **`providers/`**: Holds React context providers that wrap the entire application.
-   **`hooks/`**: Contains custom React hooks for shared, reusable logic.

## Type-Safe API Client 

To ensure end-to-end type safety, we use a client generated from our API contracts. The `callEndpoint` function from the `@packages/typed-rest` package allows you to make API requests that are fully typed based on the contract definition. The TypeScript compiler will validate the endpoint, parameters, and response types, providing an excellent developer experience with autocompletion and error checking.

**Example: Fetching a User Profile**

```typescript
// apps/nexus-web/src/app/users/[userId]/page.tsx
"use client";

import { apiCall } from "@/lib/api";
import { contract } from "@packages/nexus-api-contracts";
import { useEffect, useState } from "react";

// Define the type for the user data based on the contract
type User = typeof contract.api.user_system.users.userId.GET.response[200]["data"];

// Set the base URL for the API from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function UserProfilePage({ params }: { params: { userId: string } }) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const result = await callEndpoint(
        API_BASE_URL, 
        contract.api.user_system.users.userId.GET, 
        { params: { userId: params.userId } }
      );

      // The 'result' object is fully typed
      if (result.status === 200) {
        setUser(result.body.data); // 'result.body.data' is typed as 'User'
      } else {
        setError(result.body.message); // 'result.body.message' is typed as 'string'
      }
    };

    fetchUser();
  }, [params.userId]);

  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

This setup prevents common errors, reduces bugs, and makes the frontend code much easier to write and maintain.