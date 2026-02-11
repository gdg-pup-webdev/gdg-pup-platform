
FROM node:20-alpine AS pruner
WORKDIR /app
ENV CI=true
RUN npm install -g turbo@2.7.4
COPY . .
RUN turbo prune --scope=storybook --docker

FROM node:20-alpine AS installer
WORKDIR /app
ENV CI=true
RUN corepack enable
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install

FROM node:20-alpine AS builder
WORKDIR /app
ENV CI=true
RUN corepack enable
COPY --from=installer /app/ .
COPY --from=pruner /app/out/full/ .
RUN pnpm run build --filter=storybook

FROM nginx:alpine AS runner
COPY --from=builder /app/apps/storybook/storybook-static /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]