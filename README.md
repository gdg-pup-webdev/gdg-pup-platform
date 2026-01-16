# GDG PUP Platform

The official platform for GDG PUP, built as a modern monorepo with end-to-end type safety, contract-first architecture, and a unified development workflow.

## SETUP

This repository uses a monorepo setup using pnpm as the package manager and turborepo as the workspace manager.

Follow all the steps below in order to setup your local workspace.

1. **Clone the reponsitory**

```
git clone https://github.com/gdg-pup-webdev/gdg-pup-platform.git
cd gdg-pup-webdev
```

2. **Install pnpm and dependencies**

```
npm install -g pnpm@latest
pnpm i
```

3. **Build the project**

```
pnpm run build
```

4. **Start development mode**

```
pnpm run dev
```

If you want to know more about the tools that we use, follow the links below:
- [pnpm](https://pnpm.io/pnpm-cli)
- [turborepo](https://turborepo.dev/docs/crafting-your-repository/running-tasks)
- [turborepo_guide_youtube](https://www.youtube.com/watch?v=gpWDZir8dAA&list=WL&index=11&t=137s)

## 📚 Documentation

For a deep dive into the system architecture, contracts, backend, frontend, and database, please read the **[Architecture Guide](./docs/ARCHITECTURE.md)**.

## 🚀 Quick Start

### Prerequisites

- Node.js (v18+)
- Postgres database (Supabase recommended)
- Windows Terminal (recommended for `run.bat`)

### Installation

1. **Install dependencies**:

   ```batch
   run install -all
   ```

2. **Start Development**:
   ```batch
   run dev -all
   ```
   This will open separate tabs for the API and Web Client.

## 🏗️ Project Structure

```text
root/
├── apps/                        # Runnable applications
│   ├── nexus-api/              # Express.js Backend (Core API)
│   ├── nexus-web/              # Next.js Frontend (Web Client)
│   └── identity-api/           # Identity Service
├── packages/                    # Shared internal packages
│   ├── nexus-api-contracts/    # API Contracts (Zod Schemas & Routes)
│   ├── typed-rest/             # Type-safe Client/Server Helpers
│   └── identity-api-contracts/ # Identity Contracts
├── ...workspace configs         # Configuration files for the workspace
└── ARCHITECTURE.md              # Detailed Architecture Docs
```

## 🛠️ Monorepo CLI (`run.bat`)

A simplified command-line interface for managing the workspace.

| Command     | Usage                 | Description                       |
| ----------- | --------------------- | --------------------------------- |
| **Install** | `run install -all`    | Install dependencies for all apps |
| **Dev**     | `run dev -all`        | Start dev servers in new tabs     |
| **Build**   | `run build nexus-api` | Build a specific project          |

For more details on workflows, check the [Architecture Guide](./docs/ARCHITECTURE.md#developer-workflows).

## 💻 Tech Stack

- **Frontend**: Next.js, TailwindCSS, shadcn/ui
- **Backend**: Express.js, TypeScript
- **Database**: Supabase (PostgreSQL)
- **Contracts**: Zod, Supazod
- **Monorepo**: pnpm (package management) and turborepo (workspace management)

---

_Maintained by the GDG PUP Team_
