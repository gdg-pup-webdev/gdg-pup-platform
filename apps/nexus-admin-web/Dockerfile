
FROM node:20-alpine AS pruner
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=nexus-admin-web --docker

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

ARG NEXT_PUBLIC_NEXUS_API_URL
ARG NEXT_PUBLIC_IDENTITY_API_URL
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_PUB_KEY

ENV NEXT_PUBLIC_NEXUS_API_URL=$NEXT_PUBLIC_NEXUS_API_URL
ENV NEXT_PUBLIC_IDENTITY_API_URL=$NEXT_PUBLIC_IDENTITY_API_URL
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_PUB_KEY=$NEXT_PUBLIC_SUPABASE_PUB_KEY

RUN apk add --no-cache dos2unix && if [ -d packages/typed-rest/src ]; then find packages/typed-rest/src -type f -name '*.ts' -exec dos2unix {} +; fi
RUN pnpm turbo run build --filter=nexus-admin-web

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=builder --chown=nextjs:nodejs /app/apps/nexus-admin-web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/nexus-admin-web/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/nexus-admin-web/.next/static ./apps/nexus-admin-web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/nexus-admin-web/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/nexus-admin-web/public ./apps/nexus-admin-web/public

EXPOSE 3100
CMD ["sh", "-c", "if [ -f ./apps/nexus-admin-web/server.js ]; then node ./apps/nexus-admin-web/server.js; elif [ -f ./server.js ]; then node ./server.js; else echo 'No Next standalone server.js found' >&2; ls -la; exit 1; fi"]
