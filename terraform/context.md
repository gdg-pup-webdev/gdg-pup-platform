PROJECT CONTEXT:

This repository is a PNPM + Turborepo monorepo for the GDG PUP platform. It contains multiple apps and shared packages, with centralized configs and documentation.

Key structure:
- apps/: runtime applications
	- identity-api: backend service
	- nexus-api: backend service
	- nexus-web: Next.js frontend
	- storybook: UI component explorer
- packages/: shared libraries and contracts
	- identity-api-contracts, nexus-api-contracts: API contracts
	- spark-ui: UI component library
	- spark-tools, typed-rest: shared tooling and utilities
- configs/: shared ESLint, Tailwind, and TypeScript configs
- docs/: architecture, onboarding, coding guidelines, and specs

Tooling and workflows:
- pnpm workspaces manage dependencies across apps/packages.
- turbo.json defines task pipelines (build, dev, lint, start, test, gen-types). The dev task is persistent.
- Root scripts in package.json proxy to Turbo tasks (e.g., pnpm dev, pnpm build).
- Dockerfiles exist per app for containerized deployments; docker-compose.yml is available at repo root.

Infrastructure:
- Cloud provider: Google Cloud Platform (GCP).
- Infrastructure-as-Code: Terraform, located in terraform/ at repo root.
- terraform/environments/ contains per-environment configs (dev, staging, prod), each with its own provider, variables, outputs, and .tfvars.
- terraform/modules/ contains reusable modules (network, compute, data) shared across environments.

Current adjustments:
- Turbo concurrency is set in turbo.json to avoid dev task limits.
- Root dev script excludes storybook (turbo run dev --filter=!storybook).

