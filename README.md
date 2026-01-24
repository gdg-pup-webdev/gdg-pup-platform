# GDG PUP Platform

Welcome to the **GDG PUP Platform** – a modern, full-stack monorepo built with end-to-end type safety, contract-first architecture, and a unified development workflow. Whether you're a new contributor or an experienced developer, this guide will help you get started quickly.

---

## 🌟 New to the Project?

**Start here!** We've designed a comprehensive onboarding path to help you understand our platform and start contributing with confidence.

### ✅ Quick Start Checklist

1. **[Get Your Environment Running](#-quick-start)** – Clone the repo and run the project locally
2. **[Complete the Developer Onboarding](#-developer-onboarding)** – Learn our architecture and development practices
3. **[Explore the Codebase](#-project-structure)** – Understand how the project is organized
4. **[Start Contributing](#-documentation)** – Read our architecture guide and best practices

---

## 🚀 Quick Start

Get the platform running on your local machine in under 5 minutes.

### Prerequisites

- **Node.js** (v20+) – [Download here](https://nodejs.org/)
- **Postgres database** – We recommend [Supabase](https://supabase.com/)
- **Docker Desktop** (optional, for containerized development) – [Get Docker](https://www.docker.com/products/docker-desktop/)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/gdg-pup-webdev/gdg-pup-platform.git
   cd gdg-pup-platform
   ```

2. **Get environment variables**
   
   Contact the project organizers to obtain the necessary `.env` files and place them in the appropriate folders.

3. **Install pnpm and dependencies**
   ```bash
   npm install -g pnpm@latest
   pnpm install
   ```

4. **Build the project**
   ```bash
   pnpm run build
   ```

5. **Start development mode**
   ```bash
   pnpm run dev
   ```

🎉 **You're all set!** The platform is now running locally.

### Access Your Local Services

| Service      | URL                      | Description              |
|--------------|--------------------------|--------------------------|
| Nexus Web    | http://localhost:3000    | Next.js Frontend         |
| Nexus API    | http://localhost:8000    | Express.js Backend       |
| Identity API | http://localhost:8100    | Authentication Service   |

---

## 📖 Developer Onboarding

**New to the team?** Follow our structured onboarding curriculum to get up to speed with our architecture, development practices, and workflows.

### 🎯 Learning Path

#### **1. Getting Started**
- **[0 - Setting Up the Project](./docs/Onboarding/0-SettingUpTheProject.md)** – Detailed setup guide with troubleshooting tips
- **[0.1 - Git & GitHub Guide](./docs/Onboarding/git-gh-dev-guide.md)** – Our official Git workflow and contribution standards

#### **2. Core Concepts** (Read in Order)
- **[1 - Project Architecture](./docs/Onboarding/1-ProjectArchitecture.md)** – Understanding our monorepo structure and tech stack
- **[2 - Contract-First Development](./docs/Onboarding/2-ContractFirstDevelopment.md)** – How we ensure type safety across the entire stack
- **[3 - Layered Architecture](./docs/Onboarding/3-LayeredArchitecture.md)** – Backend design principles (controllers, services, repositories)
- **[4 - Dependency Injection](./docs/Onboarding/4-DependencyInjection.md)** – Writing modular, testable code
- **[5 - Error Handling](./docs/Onboarding/5-ErrorHandling.md)** – Our approach to graceful error management
- **[6 - Frontend Development](./docs/Onboarding/6-FrontendDevelopment.md)** – Type-safe API clients and UI components
- **[7 - Development Workflow](./docs/Onboarding/7-DevelopmentWorkflow.md)** – Daily workflows and feature development process

#### **3. Reference Guides**
- **[Best Practices](./docs/Onboarding/99.1-BestPractices.md)** – Coding standards and conventions
- **[Troubleshooting Guide](./docs/Onboarding/99.2-TroubleShootingGuides.md)** – Common issues and solutions
- **[Additional Resources](./docs/Onboarding/99.3-AdditionalResources.md)** – External documentation and tools

📚 **Full Onboarding Hub**: [docs/Onboarding/README.md](./docs/Onboarding/README.md)

---

## 🏗️ Project Structure

This monorepo is organized with clear separation between applications and shared packages:

```text
root/
├── apps/                           # Deployable applications
│   ├── nexus-api/                 # Express.js Backend (Core API)
│   ├── nexus-web/                 # Next.js Frontend (Web Client)
│   └── identity-api/              # Authentication & Identity Service
├── packages/                       # Shared internal packages
│   ├── nexus-api-contracts/       # API Contracts (Zod Schemas & Routes)
│   ├── typed-rest/                # Type-safe Client/Server Helpers
│   └── identity-api-contracts/    # Identity API Contracts
├── docs/                           # Documentation & Guides
│   ├── Onboarding/                # Developer onboarding lessons
│   ├── ARCHITECTURE.md            # System architecture details
│   └── DATABASE.md                # Database schema & migrations
└── ...workspace configs            # pnpm, turborepo, Docker configs
```

---

## 💻 Tech Stack

| Layer           | Technologies                                      |
|-----------------|---------------------------------------------------|
| **Frontend**    | Next.js 14, React, TailwindCSS, shadcn/ui        |
| **Backend**     | Express.js, TypeScript, Node.js                  |
| **Database**    | Supabase (PostgreSQL)                            |
| **Contracts**   | Zod (validation), Supazod (Supabase integration) |
| **Monorepo**    | pnpm (package manager), Turborepo (build system) |
| **DevOps**      | Docker, Docker Compose                           |

---

## 🐳 Docker Development (Alternative Setup)

Prefer containerized development? Run the entire platform with Docker.

### Docker Quick Start

1. **Create environment file**
   ```bash
   # Create .env in root directory
   NEXT_PUBLIC_NEXUS_API_URL=http://nexus-api:8000
   NEXT_PUBLIC_IDENTITY_API_URL=http://identity-api:8100
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_PUB_KEY=your-supabase-key
   ```

2. **Build and start all services**
   ```bash
   docker compose up -d --build
   ```

3. **Access services** at the URLs listed in the [Quick Start](#access-your-local-services) table

### Useful Docker Commands

| Command                            | Description                        |
|------------------------------------|------------------------------------|
| `docker compose up -d`             | Start all services (background)    |
| `docker compose up -d --build`     | Rebuild and restart all services   |
| `docker compose down`              | Stop and remove all containers     |
| `docker compose logs -f`           | View live logs from all services   |
| `docker compose logs -f nexus-web` | View logs for a specific service   |
| `docker compose ps`                | List running containers            |
| `docker compose restart`           | Restart all services               |

---

## 📚 Documentation

- **[Architecture Guide](./docs/ARCHITECTURE.md)** – Deep dive into system design, contracts, and data flow
- **[Database Guide](./docs/DATABASE.md)** – Schema design, migrations, and Supabase setup
- **[Developer Onboarding](./docs/Onboarding/README.md)** – Comprehensive learning path for new contributors

---

## 🛠️ Learn More About Our Tools

- **[pnpm](https://pnpm.io/pnpm-cli)** – Fast, disk space efficient package manager
- **[Turborepo](https://turborepo.dev/docs)** – High-performance build system for monorepos
- **[Turborepo Video Guide](https://www.youtube.com/watch?v=gpWDZir8dAA)** – Visual walkthrough

---

## 🤝 Contributing

We welcome contributions! All contributions must follow the official contribution guide **[GDG PUP Contribution Guide](./docs/Onboarding/git-gh-dev-guide.md)**, which covers:

Follow this: **[Contribution Guide](./docs/Onboarding/git-gh-dev-guide.md)**
- Branch naming conventions
- Commit message formatting (Conventional Commits)
- The Pull Request (PR) process
- Standardized workflows

Before submitting a PR, please ensure you have:
1. Completed the [Developer Onboarding](#-developer-onboarding) curriculum
2. Read our [Best Practices](./docs/Onboarding/99.1-BestPractices.md) guide
3. Followed the [Development Workflow](./docs/Onboarding/7-DevelopmentWorkflow.md)

---

## 💬 Need Help?

- **Setup Issues?** Check the [Troubleshooting Guide](./docs/Onboarding/99.2-TroubleShootingGuides.md)
- **Architecture Questions?** See the [Architecture Guide](./docs/ARCHITECTURE.md)
- **Still stuck?** Reach out to the project organizers

---

_Maintained with ❤️ by the GDG PUP Team_
