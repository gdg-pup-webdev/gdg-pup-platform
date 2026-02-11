
FROM node:20-alpine AS pruner
WORKDIR /app
RUN npm install -g turbo@2.7.4
COPY . .
RUN turbo prune --scope=storybook --docker

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

FROM node:20-alpine AS runner
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/apps/storybook/storybook-static ./storybook-static
EXPOSE 6006
CMD ["serve", "-s", "storybook-static", "-p", "6006"]
