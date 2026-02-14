
FROM node:20-alpine AS pruner
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=identity-api --docker

FROM node:20-alpine AS installer
WORKDIR /app
RUN corepack enable
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
  pnpm install --frozen-lockfile

FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable
COPY --from=installer /app/ .
COPY --from=pruner /app/out/full/ .
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
  pnpm install --frozen-lockfile

RUN apk add --no-cache dos2unix && dos2unix packages/typed-rest/src/cli.ts
RUN pnpm turbo run build --filter=identity-api

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable

# Copy monorepo config files
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/pnpm-workspace.yaml ./

# Copy the API app (only package.json and compiled dist)
COPY --from=builder /app/apps/identity-api/package.json ./apps/identity-api/package.json
COPY --from=builder /app/apps/identity-api/dist ./apps/identity-api/dist

# Copy workspace dependencies (only package.json and dist)
COPY --from=builder /app/packages/identity-api-contracts/package.json ./packages/identity-api-contracts/package.json
COPY --from=builder /app/packages/identity-api-contracts/dist ./packages/identity-api-contracts/dist
COPY --from=builder /app/packages/typed-rest/package.json ./packages/typed-rest/package.json
COPY --from=builder /app/packages/typed-rest/dist ./packages/typed-rest/dist

# Install only production dependencies (no devDependencies)
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
  pnpm install --prod --frozen-lockfile

WORKDIR /app/apps/identity-api
EXPOSE 8100
CMD ["node", "dist/index.js"]
