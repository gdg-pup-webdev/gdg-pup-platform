# Monorepo Architecture Context

## Tech Stack

- **Frontend:** Next.js, Tailwind CSS, shadcn/ui
- **Backend:** Express.js, TypeScript
- **Database:** Supabase (PostgreSQL)
- **Tooling & Infrastructure:** Zod (Contracts), pnpm, Turborepo, Docker / Docker Compose

## Workspace Structure

```text
gdg-pup-platform/
├── apps/                        # Deployable applications
│   ├── nexus-api/               # Express.js Backend API
│   ├── nexus-web/               # Next.js Frontend
│   ├── identity-api/            # Authentication Service
│   └── storybook/               # UI component development environment
├── packages/                    # Shared internal libraries
│   ├── typed-rest/              # Type-safe API client/server helpers
│   ├── nexus-api-contracts/     # Core API schemas (Zod)
│   ├── identity-api-contracts/  # Identity service schemas (Zod)
│   └── spark-ui/                # Internal UI component library
└── configs/                     # Shared workspace tooling
    ├── eslint-config/
    ├── typescript-config/
    └── tailwind-config/
```

## Core Principles

1.  **Contract-First Development:** API contracts are defined prior to implementation to establish a strict interface between frontend and backend.
2.  **End-to-End Type Safety:** Strict type enforcement from the database layer up to the frontend UI to catch errors at build time.
3.  **Shared API Contracts:** Zod schemas act as a single source of truth in the `packages/` directory to guarantee client/server synchronization.
4.  **Modular Architecture:** Code is organized by feature into self-contained modules to enforce separation of concerns and scalability.
5.  **API Clean Architecture:** API follows the rules of clean architecture which imposes the dependency rule and separates responsibilities across different layers.