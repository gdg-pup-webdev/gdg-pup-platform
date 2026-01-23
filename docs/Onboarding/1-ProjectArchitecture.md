**[⬅️ Previous: Setting Up the Project](./0-SettingUpTheProject.md)** | **[Back to Onboarding](./README.md)** | **[Next: Contract-First Development ➡️](./2-ContractFirstDevelopment.md)**

---

# Project Architecture

This document provides a high-level overview of the project's architecture, technology stack, and core principles. For a more detailed explanation, please refer to the **[Architecture Guide](../../ARCHITECTURE.md)**.

## Technology Stack

The project is built with the following technologies:

-   **Frontend**: Next.js, Tailwind CSS, shadcn/ui
-   **Backend**: Express.js, TypeScript
-   **Database**: Supabase (PostgreSQL)
-   **API Contracts**: Zod
-   **Monorepo**: pnpm, Turborepo
-   **Containerization**: Docker, Docker Compose

## Monorepo Structure

The repository is organized as a monorepo with the following structure:

```
gdgnexussecondclone/
├── apps/
│   ├── nexus-api/              # Express.js Backend API
│   ├── nexus-web/              # Next.js Frontend
│   └── identity-api/           # Authentication Service
│
├── packages/
│   ├── typed-rest/             # Type-safe API client/server helpers
│   ├── nexus-api-contracts/    # API contract definitions & schemas
│   └── identity-api-contracts/ # Identity service API contracts
│
├── configs/
│   ├── eslint-config/          # Shared ESLint configuration
│   └── typescript-config/      # Shared TypeScript configuration
│
├── .gitignore
├── package.json                # Root workspace configuration
├── pnpm-workspace.yaml         # pnpm workspace definition
└── turbo.json                  # Turborepo configuration
```

-   **`apps/`**: Contains deployable applications, such as backend servers and frontend web apps.
-   **`packages/`**: Contains shared libraries and modules consumed by applications or other packages.
-   **`configs/`**: Contains shared configurations for tools like ESLint and TypeScript, ensuring consistency across the monorepo.

## Key Principles

The development process is guided by these core principles:

1.  **Contract-First Development**: API contracts are defined before implementation to ensure a clear and stable interface between the frontend and backend.
2.  **End-to-End Type Safety**: We enforce type safety from the database to the frontend, catching errors at build time and improving developer experience.
3.  **Shared API Contracts**: A single source of truth for API schemas prevents inconsistencies and ensures frontend and backend are always in sync.
4.  **Modular Architecture**: Features are developed in self-contained modules to promote separation of concerns and improve maintainability. We encourage organizing code by feature within each project.
