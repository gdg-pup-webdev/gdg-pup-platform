
FROM node:20-alpine AS pruner
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=nexus-web --docker

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

ARG NEXT_PUBLIC_NEXUS_API_URL
ARG NEXT_PUBLIC_IDENTITY_API_URL
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_PUB_KEY

ENV NEXT_PUBLIC_NEXUS_API_URL=$NEXT_PUBLIC_NEXUS_API_URL
ENV NEXT_PUBLIC_IDENTITY_API_URL=$NEXT_PUBLIC_IDENTITY_API_URL
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_PUB_KEY=$NEXT_PUBLIC_SUPABASE_PUB_KEY

RUN apk add --no-cache dos2unix && dos2unix packages/typed-rest/src/cli.ts
RUN pnpm turbo run build --filter=nexus-web

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=builder --chown=nextjs:nodejs /app/apps/nexus-web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/nexus-web/.next/static ./apps/nexus-web/.next/static

EXPOSE 3000
CMD ["node", "apps/nexus-web/server.js"]
