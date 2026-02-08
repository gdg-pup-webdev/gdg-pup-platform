# =============================================================================
# Makefile — GDG PUP Platform
# =============================================================================
# Usage:
#   make dev          Build & run development
#   make staging      Build & run staging
#   make prod         Build & run production (detached)
#   make dev-up       Run development (no build)
#   make staging-up   Run staging (no build)
#   make prod-up      Run production (no build, detached)
#   make down         Stop all containers
#   make clean        Stop and remove containers, volumes, images
# =============================================================================

COMPOSE = docker compose
BASE    = -f docker-compose.yml

# Environment-specific env files for build arg interpolation
DEV_ENV     = --env-file apps/nexus-web/.env
STAGING_ENV = --env-file apps/nexus-web/.env.staging
PROD_ENV    = --env-file apps/nexus-web/.env.prod

# ---- Development ----
.PHONY: dev dev-up dev-build
dev:
	$(COMPOSE) $(DEV_ENV) $(BASE) -f docker-compose.dev.yml up --build

dev-up:
	$(COMPOSE) $(DEV_ENV) $(BASE) -f docker-compose.dev.yml up

dev-build:
	$(COMPOSE) $(DEV_ENV) $(BASE) -f docker-compose.dev.yml build

# ---- Staging ----
.PHONY: staging staging-up staging-build
staging:
	$(COMPOSE) $(STAGING_ENV) $(BASE) -f docker-compose.staging.yml up --build

staging-up:
	$(COMPOSE) $(STAGING_ENV) $(BASE) -f docker-compose.staging.yml up

staging-build:
	$(COMPOSE) $(STAGING_ENV) $(BASE) -f docker-compose.staging.yml build

# ---- Production ----
.PHONY: prod prod-up prod-build
prod:
	$(COMPOSE) $(PROD_ENV) $(BASE) -f docker-compose.prod.yml up --build -d

prod-up:
	$(COMPOSE) $(PROD_ENV) $(BASE) -f docker-compose.prod.yml up -d

prod-build:
	$(COMPOSE) $(PROD_ENV) $(BASE) -f docker-compose.prod.yml build

# ---- Common ----
.PHONY: down clean logs
down:
	$(COMPOSE) $(BASE) down

clean:
	$(COMPOSE) $(BASE) down --rmi all --volumes --remove-orphans

logs:
	$(COMPOSE) $(BASE) logs -f
