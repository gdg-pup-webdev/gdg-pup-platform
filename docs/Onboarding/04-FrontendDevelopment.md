
## Frontend (Nexus Web)

### 🎨 Frontend Architecture

```
apps/nexus-web/
├── app/                              # Next.js App Router
│   ├── page.tsx                      # Homepage
│   ├── layout.tsx                    # Root layout
│   ├── events/
│   │   ├── page.tsx                  # Events list page
│   │   └── [eventId]/
│   │       └── page.tsx              # Event detail page
│   └── users/
│       └── [userId]/
│           └── page.tsx              # User profile page
├── components/                       # React components
│   ├── ui/                           # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── input.tsx
│   └── features/                     # Feature-specific components
│       ├── EventCard.tsx
│       └── UserProfile.tsx
├── lib/                              # Utilities
│   ├── api.ts                        # API client setup
│   └── utils.ts                      # Helper functions
├── hooks/                            # Custom React hooks
│   ├── useAuth.ts                    # Authentication hook
│   └── useApi.ts                     # API calling hook
└── styles/
    └── globals.css                   # Global styles
```

### 📡 Type-Safe API Client
you can use another function from @packages/api-typing to call an api endpoint using the contract
it allows you to receive a fully typed result
```typescript
// apps/nexus-web/lib/api.ts
import { callEndpoint } from "@packages/api-typing";
import { Contract } from "@packages/nexus-api-contracts";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Helper function for authenticated API calls
export async function apiCall<T extends keyof typeof Contract>(
  endpoint: T,
  options: {
    params?: any;
    query?: any;
    body?: any;
    token?: string;
  },
) {
  return await callEndpoint(API_BASE_URL, endpoint as any, options);
}

// Example: Fetch user
export async function getUser(userId: string, token: string) {
  const result = await callEndpoint(
    API_BASE_URL,
    Contract.userSystem.users.userId.GET,
    {
      params: { userId },
      token,
    },
  );

  // Type-safe response handling
  if (result.status === 200) {
    return result.body.data; // ← Fully typed!
  }

  throw new Error(result.body.message);
}
```