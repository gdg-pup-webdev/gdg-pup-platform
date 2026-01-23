
FROM node:20-alpine AS pruner
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=nexus-api --docker

FROM node:20-alpine AS installer
WORKDIR /app
RUN corepack enable
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install

FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable
COPY --from=installer /app/ .
COPY --from=pruner /app/out/full/ .
RUN pnpm install

RUN apk add --no-cache dos2unix && dos2unix packages/typed-rest/src/cli.ts
RUN pnpm turbo run build --filter=nexus-api

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable

# Copy monorepo config files
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/pnpm-workspace.yaml ./

# Copy the API app (only package.json and compiled dist)
COPY --from=builder /app/apps/nexus-api/package.json ./apps/nexus-api/package.json
COPY --from=builder /app/apps/nexus-api/dist ./apps/nexus-api/dist
COPY --from=builder /app/apps/nexus-api/src ./apps/nexus-api/src

# Copy workspace dependencies (only package.json and dist)
COPY --from=builder /app/packages/nexus-api-contracts/package.json ./packages/nexus-api-contracts/package.json
COPY --from=builder /app/packages/nexus-api-contracts/dist ./packages/nexus-api-contracts/dist
COPY --from=builder /app/packages/typed-rest/package.json ./packages/typed-rest/package.json
COPY --from=builder /app/packages/typed-rest/dist ./packages/typed-rest/dist

# Install only production dependencies (no devDependencies)
RUN pnpm install --prod --frozen-lockfile

WORKDIR /app/apps/nexus-api
EXPOSE 8000
CMD ["node", "dist/index.js"]
