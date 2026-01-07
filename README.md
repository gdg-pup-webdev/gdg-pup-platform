# Monorepo Structure

```text
root/
├── run.bat                      # repo CLI helper for install/build/dev
├── package.json                 # root workspace package.json
├── apps/                        # runnable applications (vertical slices)
|   ├── webdev-api/              # backend API (Express + TypeScript)
|   └── webdev-web/              # frontend (Next.js)
└── packages/                    # shared, importable packages
    ├── api-typing/              # shared TypeScript types and client/server helpers
    └── webdev-api-contracts/    # contracts, schema factories and enforcers
```

Overview:

- `apps/` contains runnable projects. Each app is self-contained with its own `package.json`, `tsconfig.json`, and start/build scripts. Apps follow a "vertical slice" style: a feature's API, UI and storage logic live together inside an app.
- `packages/` contains sharable code used by apps. Keep packages small and focused (types, contracts, utilities). Treat packages like lightweight npm modules so they remain reusable and testable.
- `api-typing` provides strongly typed client/server helpers: the typed API client (`client/apiClient.ts`) and server enforcers (`server/apiServer.ts`). Use these to keep request/response types in sync.
- `webdev-api-contracts` contains runtime schema factories and contract definitions consumed by both API and frontend to validate/enforce payloads and generate types.

Development notes:

- When developing, prefer editing packages first, then run the appropriate app. Use `run install` or your package manager workspace (e.g., `pnpm`) to link local packages.
- Use `run dev -all` to open each app in its own Windows Terminal tab for parallel development.
- Naming: use kebab-case (e.g., `webdev-api`, `webdev-web`) — the `run.bat` script expects folder names found under `apps/`.

Add a new app/package (quick steps):

1. Create folder under `apps/` or `packages/`.
2. Add `package.json` and scripts (`dev`, `build`, `start`).
3. Add `tsconfig.json` (or extend root config) and ensure path/exports are correct.
4. If needed, update the root `package.json` workspaces or `run.bat` targets.
5. Install dependencies and run `run dev <new-app>` to verify.

Contracts & types workflow:

- Keep contract definitions in `packages/webdev-api-contracts/src/contracts` and generate or export types into `packages/api-typing` when required.
- Prefer importing contract enforcement from the contracts package on the server and the generated types on the client to avoid duplication.

This structure balances independent deployable apps with shared, versioned packages for types and contracts — enabling clear ownership and safe cross-service changes.

# Monorepo CLI Utility (`run.bat`)

A simplified command-line interface for managing multiple TypeScript projects within the `apps/` directory. It handles installation, building, and development workflows, leveraging **Windows Terminal** for an optimized developer experience. 

## 🛠 Usage

Open your terminal in the root directory and run:

```bash
run <command> <projects... | -all>

```

### Commands

| Command | Description | Behavior |
| --- | --- | --- |
| `install` | Install dependencies (`npm install`) | Runs sequentially in current window. |
| `build` | Build projects (`npm run build`) | Runs sequentially in current window. |
| `dev` | Start dev server (`npm run dev`) | Opens **new tabs** in Windows Terminal. |

## 💡 Examples

### 1. Install Dependencies

**Install for all projects:**

```batch
run install -all

```

**Install for specific projects:**

```batch
run install webdev-api webdev-web

```

### 2. Start Development

**Launch everything:**
This will open two new tabs in your current window, labeled `webdev-api` and `webdev-web`.

```batch
run dev -all

```

**Launch only the API:**

```batch
run dev webdev-api

```

### 3. Build for Production

**Build specific projects:**

```batch
run build webdev-web

```

