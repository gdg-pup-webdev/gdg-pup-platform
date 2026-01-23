# GDG PUP Platform

The official platform for GDG PUP, built as a modern monorepo with end-to-end type safety, contract-first architecture, and a unified development workflow.

## SETUP

This repository uses a monorepo setup using **pnpm** as the package manager and **turborepo** as the workspace manager.

Follow all the steps below in order to setup your local workspace.

1. **Clone the reponsitory**

```cmd
git clone https://github.com/gdg-pup-webdev/gdg-pup-platform.git
cd gdg-pup-webdev
```

2. **Add the .env files**
Ask the project organizers for the .env files and put then in the appropriate folders.

3. **Install pnpm and dependencies**

```cmd
npm install -g pnpm@latest
pnpm i
```

4. **Build the project**

```cmd
pnpm run build
```

5. **Start development mode**

```cmd
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

- Node.js (v20+)
- Postgres database (Supabase recommended)
- Docker Desktop (for containerized development)

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

## 💻 Tech Stack

- **Frontend**: Next.js, TailwindCSS, shadcn/ui
- **Backend**: Express.js, TypeScript
- **Database**: Supabase (PostgreSQL)
- **Contracts**: Zod, Supazod
- **Monorepo**: pnpm (package management) and turborepo (workspace management)
- **Containerization**: Docker, Docker Compose

## 🐳 Docker Development

Run the entire platform locally using Docker containers.

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

### Quick Start with Docker

1. **Create environment file** (copy from example or create new):

   ```bash
   # Root .env for docker-compose
   NEXT_PUBLIC_NEXUS_API_URL=http://nexus-api:8000
   NEXT_PUBLIC_IDENTITY_API_URL=http://identity-api:8100
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_PUB_KEY=your-supabase-key
   ```

2. **Build and start all services**:

   ```bash
   docker compose up -d --build
   ```

3. **Access the services**:
   | Service | URL |
   |---------|-----|
   | Nexus Web | http://localhost:3000 |
   | Nexus API | http://localhost:8000 |
   | Identity API | http://localhost:8100 |

### Docker Commands

| Command                            | Description                    |
| ---------------------------------- | ------------------------------ |
| `docker compose up -d`             | Start all services (detached)  |
| `docker compose up -d --build`     | Rebuild and start all services |
| `docker compose down`              | Stop and remove all containers |
| `docker compose logs -f`           | View logs from all services    |
| `docker compose logs -f nexus-web` | View logs for specific service |
| `docker compose ps`                | List running containers        |
| `docker compose restart`           | Restart all services           |

---

_Maintained by the GDG PUP Team_
