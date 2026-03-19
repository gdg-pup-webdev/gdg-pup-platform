# GDG PUP Nexus Web Platform

Welcome to the `nexus-web` codebase. This is a Next.js 16 (App Router) application that serves as the primary frontend for the GDG PUP Nexus platform.

## 🚀 Project Overview

- **Core Tech Stack:** Next.js 16 (App Router), React 19, TypeScript 5.
- **Styling:** Tailwind CSS 4, Motion (framer-motion), Lenis (smooth scrolling).
- **UI Components:** Built on top of `@packages/spark-ui` (internal design system).
- **Data Management:** TanStack React Query for data fetching and caching, Supabase for authentication and database integration.
- **Contract-First API:** Integrated with `@packages/nexus-api-contracts` and `@packages/typed-rest` for end-to-end type safety.

## 🏗️ Architecture

The project follows a **feature-based architecture** to ensure modularity and scalability.

- `src/app/`: Next.js App Router pages and layouts. Routes are logically grouped (e.g., `(auth)`, `about`, `events`).
- `src/features/`: Contains all business logic, feature-specific components, hooks, and API interactions. Each feature should be independent and exported via an `index.ts`.
- `src/components/`: Generic, reusable UI components (e.g., `Navbar`, `Footer`, `shared/`).
- `src/providers/`: Global context providers (e.g., `AuthProvider`, `LenisProvider`, `QueryProvider`).
- `src/lib/`: Library configurations and shared utility functions.
- `src/configs/`: Global application configurations.
- `scripts/`: Utility scripts for development (e.g., `generate-feature.ts`, `convert-to-webp.ts`).

## 🛠️ Building and Running

Ensure you have `pnpm` installed and are in the `apps/nexus-web` directory.

### Development
```bash
pnpm dev
```
Starts the development server on [http://localhost:3000](http://localhost:3000).

### Production
```bash
pnpm build
pnpm start
```
Builds the application for production and starts the server.

### Linting
```bash
pnpm lint
```
Runs ESLint to ensure code quality.

### Code Generation
```bash
pnpm g <feature-name>
```
Generates a new feature module in `src/features/` with the standard structure (`api/`, `components/`, `hooks/`, `types.ts`, `index.ts`).

### Image Optimization
```bash
pnpm webp
```
Converts images in the `public/` directory to WebP format.

## ✍️ Development Conventions

### 1. Feature-First Development
All new business logic and feature-specific UI should go into `src/features`. Avoid putting everything into `src/components`.

### 2. Standardized Feature Structure
A feature should ideally follow this structure:
```text
src/features/<feature-name>/
├── api/          # API call functions using typed-rest
├── components/   # Feature-specific React components
├── hooks/        # Feature-specific custom hooks
├── types.ts      # Feature-specific TypeScript interfaces
└── index.ts      # Public API for the feature (exports only what is needed)
```

### 3. Contract-First API
Always use the shared API contracts from `@packages/nexus-api-contracts`. This ensures that your frontend is always in sync with the backend.

### 4. Client-Side State & Fetching
- Use **React Query** for all data fetching.
- Use **Motion** for animations.
- Use **Lenis** for smooth scrolling experiences.

### 5. Naming Conventions
- **Files/Folders:** kebab-case (e.g., `user-profile`, `SignInForm.tsx`).
- **Components:** PascalCase (e.g., `Navbar`, `Button`).
- **Hooks:** starts with `use` (e.g., `useAuth`, `useEvents`).

## 🔒 Security & Standards
- Never commit `.env` files.
- Ensure all components are accessible (A11y).
- Follow the architectural guidelines provided in the root `gemini.md`.
