# Nexus API (Backend)

## Recommended Local Startup

- From workspace root, run: `pnpm dev:backend`
- This now rebuilds `@packages/nexus-api-contracts` first, then starts backend dev mode.

## App-Only Startup

- From `apps/nexus-api`, run: `pnpm dev:local`
- This also rebuilds contracts before starting `tsx watch`.

## Troubleshooting: `Cannot read properties of undefined (reading 'POST')`

If you see an error like:

`contract.api.v1.event_highlights.POST` is undefined

the contracts build output is stale.

Fix steps:

1. From workspace root: `pnpm --filter @packages/nexus-api-contracts build`
2. Confirm generated route files exist:
   - `packages/nexus-api-contracts/dist/routes/api/v1/event-highlights/POST.js`
   - `packages/nexus-api-contracts/dist/routes/api/v1/event-highlights/[id]/GET.js`
3. Start backend using `pnpm dev:backend` (or `pnpm dev:local` from `apps/nexus-api`)

The API bootstrap includes a startup guard that fails fast with this guidance when critical contract keys are missing.
