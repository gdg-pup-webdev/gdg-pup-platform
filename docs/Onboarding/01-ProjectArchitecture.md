
## 📚 Documentation

For a deep dive into the system architecture, contracts, backend, frontend, and database, please read the **[Architecture Guide](./docs/ARCHITECTURE.md)**.



## 💻 Tech Stack

- **Frontend**: Next.js, TailwindCSS, shadcn/ui
- **Backend**: Express.js, TypeScript
- **Database**: Supabase (PostgreSQL)
- **Contracts**: Zod, Supazod
- **Monorepo**: pnpm (package management) and turborepo (workspace management)
- **Containerization**: Docker, Docker Compose



```
gdg-pup-platform/
├── run.bat                           # CLI tool for managing workspace
├── apps/                             # Runnable applications
│   ├── nexus-api/                    # Express.js Backend API
│   ├── nexus-web/                    # Next.js Frontend
│   └── identity-api/                 # Authentication Service
├── packages/                         # Shared packages
│   ├── api-typing/                   # Type-safe API client/server helpers
│   ├── nexus-api-contracts/          # Contract definitions & schemas
│   └── identity-api-contracts/       # Identity service contracts
├── configs/                         # Config packages
│   ├── eslint-config/                   # package containing base config for eslint
│   ├── typescript-config/          # package containing base config for ts
└── package.json                      # Root workspace configuration
└── pnpm-workspace.yaml                      #  
└── turbo.json                      #  

```
directories under apps, packages, and configs are ts packages which has their own package.json. 

configs are used as base configs to be consumed across the application 

packages are packages that are used in apps or in other packages.

apps are deployed applications which could be servers or web apps or mobile apps. 

within projects, we highly recommended ko ang folder by feature as much as possible 

### 🎯 Key Principles

1. **Contract-First Development**: Define API contracts before implementation
2. **Type Safety**: End-to-end type safety from DB → Backend → Frontend
3. **Shared Contracts**: Single source of truth for API schemas
4. **Modular Architecture**: Each feature is a self-contained module

---



