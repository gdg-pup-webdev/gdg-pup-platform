# GDG PUP Platform

Welcome to the **GDG PUP Platform** – a modern, full-stack monorepo built with end-to-end type safety, contract-first architecture, and a unified development workflow.

---

## 🌟 New to the Project?

**Start here!** Follow this path to get up and running:

1. **[Quick Start](#-quick-start)** – Get the platform running locally
2. **[Developer Onboarding](#-developer-onboarding)** – Learn our architecture and practices
3. **[Coding Guidelines](#-coding-guidelines)** – Understand our development standards
4. **[Start Contributing](#-contributing)** – Begin making contributions

---

## 🚀 Quick Start

Get the platform running on your local machine in under 5 minutes.

### Prerequisites

- **Node.js** (v20+) – [Download here](https://nodejs.org/)
- **Postgres database** – We recommend [Supabase](https://supabase.com/)
- **pnpm** – Fast package manager (`npm install -g pnpm@latest`)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/gdg-pup-webdev/gdg-pup-platform.git
cd gdg-pup-platform

# 2. Install dependencies
pnpm install

# 3. Get environment variables (contact project organizers)

# 4. Build the project
pnpm run build

# 5. Start development
pnpm run dev
```

### Access Your Services

| Service      | URL                      |
|--------------|--------------------------|
| Nexus Web    | http://localhost:3000    |
| Nexus API    | http://localhost:8000    |
| Identity API | http://localhost:8100    |

---

## 📖 Developer Onboarding

**New to the team?** Complete our structured onboarding curriculum to understand the platform.

### Learning Path

1. **[Setting Up the Project](./docs/Onboarding/0-SettingUpTheProject.md)** – Detailed setup with troubleshooting
2. **[Project Architecture](./docs/Onboarding/1-ProjectArchitecture.md)** – Monorepo structure and tech stack
3. **[Contract-First Development](./docs/Onboarding/2-ContractFirstDevelopment.md)** – Type safety across the stack
4. **[Layered Architecture](./docs/Onboarding/3-LayeredArchitecture.md)** – Backend design principles
5. **[Dependency Injection](./docs/Onboarding/4-DependencyInjection.md)** – Modular, testable code
6. **[Error Handling](./docs/Onboarding/5-ErrorHandling.md)** – Graceful error management
7. **[Frontend Development](./docs/Onboarding/6-FrontendDevelopment.md)** – Type-safe clients and UI
8. **[Development Workflow](./docs/Onboarding/7-DevelopmentWorkflow.md)** – Daily development process

**📚 Complete Guide**: [docs/Onboarding/README.md](./docs/Onboarding/README.md)

---

## 📋 Coding Guidelines

Our coding guidelines ensure code quality, scalability, and consistency across the platform.

### Quick Reference

**Backend Development**
- **[101 - API Utilities](./docs/CodingGuidelines/101-ApiUtilities.md)** – Reusable utility functions
- **[102 - Layered Architecture](./docs/CodingGuidelines/102-LayeredArchitecture.md)** – Backend structure
- **[103 - Contract-First Development](./docs/CodingGuidelines/103-ContractFirstDevelopment.md)** – API contracts
- **[104 - Shallow Routes Design](./docs/CodingGuidelines/104-ShallowRoutesDesign.md)** – Endpoint conventions
- **[105 - Error Handling](./docs/CodingGuidelines/105-ErrorHandling.md)** – Error patterns

**Project Structure**
- **[401 - File Structure](./docs/CodingGuidelines/401-FileStructure.md)** – Folder organization

**General Standards**
- **[503 - Code Readability](./docs/CodingGuidelines/503-CodeReadability.md)** – Self-documenting code
- **[504 - Documenting Your Code](./docs/CodingGuidelines/504-DocumentingYourCode.md)** – Documentation practices

**Collaboration**
- **[701 - Opening an Issue](./docs/CodingGuidelines/701-OpeningAnIssue.md)** – Issue creation
- **[702 - Submitting a Pull Request](./docs/CodingGuidelines/702-SubmittingAPullRequest.md)** – PR standards
- **[703 - Naming Your Branches](./docs/CodingGuidelines/703-NamingYourBranches.md)** – Branch naming
- **[704 - Commit Conventions](./docs/CodingGuidelines/704-CommitConventions.md)** – Commit messages
- **[705 - Contributing](./docs/CodingGuidelines/705-Contributing.md)** – Contribution workflow

**� All Guidelines**: [docs/CodingGuidelines/README.md](./docs/CodingGuidelines/README.md)

---

## 🤝 Contributing

We welcome contributions! Before submitting a PR:

1. **Complete Onboarding** – [Developer Onboarding](#-developer-onboarding)
2. **Read Guidelines** – [Coding Guidelines](#-coding-guidelines)
3. **Follow Workflow** – [705 - Contributing](./docs/CodingGuidelines/705-Contributing.md)

### Quick Contribution Steps

1. Open or find an issue – [701 - Opening an Issue](./docs/CodingGuidelines/701-OpeningAnIssue.md)
2. Create a branch – [703 - Naming Your Branches](./docs/CodingGuidelines/703-NamingYourBranches.md)
3. Make changes following our [Coding Guidelines](#-coding-guidelines)
4. Commit with proper format – [704 - Commit Conventions](./docs/CodingGuidelines/704-CommitConventions.md)
5. Submit a PR – [702 - Submitting a Pull Request](./docs/CodingGuidelines/702-SubmittingAPullRequest.md)

---

## Additional Information

### 🏗️ Project Structure

```text
root/
├── apps/                           # Deployable applications
│   ├── nexus-api/                 # Express.js Backend
│   ├── nexus-web/                 # Next.js Frontend
│   └── identity-api/              # Authentication Service
├── packages/                       # Shared packages
│   ├── nexus-api-contracts/       # API Contracts (Zod Schemas)
│   ├── typed-rest/                # Type-safe Client/Server
│   └── identity-api-contracts/    # Identity Contracts
├── docs/                           # Documentation
│   ├── Onboarding/                # Developer onboarding
│   └── CodingGuidelines/          # Coding standards
└── ...configs                      # Tooling configuration
```

---

### 💻 Tech Stack

| Layer           | Technologies                                      |
|-----------------|---------------------------------------------------|
| **Frontend**    | Next.js 14, React, TailwindCSS, shadcn/ui        |
| **Backend**     | Express.js, TypeScript, Node.js                  |
| **Database**    | Supabase (PostgreSQL)                            |
| **Contracts**   | Zod, Supazod                                     |
| **Monorepo**    | pnpm, Turborepo                                  |
| **DevOps**      | Docker, Docker Compose                           |

---


### � Docker Development (Optional)

Prefer containerized development? Use Docker:

```bash
# Build and start all services
docker compose up -d --build

# View logs
docker compose logs -f

# Stop services
docker compose down
```

**Useful Commands**: See [Docker section](./docs/Onboarding/0-SettingUpTheProject.md#docker-setup) in setup guide.

---

### 📚 Additional Documentation

- **[Architecture Guide](./docs/ARCHITECTURE.md)** – System design and data flow
- **[Database Guide](./docs/DATABASE.md)** – Schema and migrations
- **[Troubleshooting](./docs/Onboarding/99.2-TroubleShootingGuides.md)** – Common issues and solutions

---

## 💬 Need Help?

- **Setup Issues?** → [Troubleshooting Guide](./docs/Onboarding/99.2-TroubleShootingGuides.md)
- **Architecture Questions?** → [Architecture Guide](./docs/ARCHITECTURE.md)
- **Coding Standards?** → [Coding Guidelines](./docs/CodingGuidelines/README.md)
- **Still Stuck?** → Reach out to project organizers

---

_Maintained with ❤️ by the GDG PUP Team_
