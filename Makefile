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
#   make dev-down     Stop development stack
#   make staging-down Stop staging stack
#   make prod-down    Stop production stack
#   make push-dev     Tag & push dev images to Docker Hub
#   make push-staging Tag & push staging images to Docker Hub
#   make push-prod    Tag & push prod images to Docker Hub
#   make down         Stop all containers
#   make clean        Stop and remove containers, volumes, images
# =============================================================================

COMPOSE = docker compose
BASE    = -f docker-compose.yml

# Docker Hub org
DOCKER_ORG = gdgpup

# Services and their local image names
SERVICES = identity-api nexus-api nexus-web

# Environment-specific env files for build arg interpolation
DEV_ENV     = --env-file apps/nexus-web/.env
STAGING_ENV = --env-file apps/nexus-web/.env.staging
PROD_ENV    = --env-file apps/nexus-web/.env.prod

# ---- Development ----
.PHONY: dev dev-up dev-build dev-down
dev:
	$(COMPOSE) $(DEV_ENV) $(BASE) -f docker-compose.dev.yml up --build

dev-up:
	$(COMPOSE) $(DEV_ENV) $(BASE) -f docker-compose.dev.yml up

dev-build:
	$(COMPOSE) $(DEV_ENV) $(BASE) -f docker-compose.dev.yml build

dev-down:
	$(COMPOSE) $(DEV_ENV) $(BASE) -f docker-compose.dev.yml down

# ---- Staging ----
.PHONY: staging staging-up staging-build staging-down
staging:
	$(COMPOSE) $(STAGING_ENV) $(BASE) -f docker-compose.staging.yml up --build

staging-up:
	$(COMPOSE) $(STAGING_ENV) $(BASE) -f docker-compose.staging.yml up

staging-build:
	$(COMPOSE) $(STAGING_ENV) $(BASE) -f docker-compose.staging.yml build

staging-down:
	$(COMPOSE) $(STAGING_ENV) $(BASE) -f docker-compose.staging.yml down

# ---- Production ----
.PHONY: prod prod-up prod-build prod-down
prod:
	$(COMPOSE) $(PROD_ENV) $(BASE) -f docker-compose.prod.yml up --build -d

prod-up:
	$(COMPOSE) $(PROD_ENV) $(BASE) -f docker-compose.prod.yml up -d

prod-build:
	$(COMPOSE) $(PROD_ENV) $(BASE) -f docker-compose.prod.yml build

prod-down:
	$(COMPOSE) $(PROD_ENV) $(BASE) -f docker-compose.prod.yml down

# ---- Push Images to Docker Hub ----
# Custom domain base for each environment
DOMAIN = gdgpup.org

.PHONY: push-dev push-staging push-prod

push-dev:
	@echo "==> Rebuilding nexus-web with custom domain URLs..."
	NEXT_PUBLIC_NEXUS_API_URL=https://api.dev.$(DOMAIN) \
	NEXT_PUBLIC_IDENTITY_API_URL=https://identity.dev.$(DOMAIN) \
	$(COMPOSE) $(DEV_ENV) $(BASE) -f docker-compose.dev.yml build nexus-web
	@echo "==> Tagging and pushing images..."
	@for svc in $(SERVICES); do \
		docker tag gdg-pup-platform-$$svc:gdg-pup-platform-dev $(DOCKER_ORG)/gdg-pup-platform-$$svc:dev; \
		docker push $(DOCKER_ORG)/gdg-pup-platform-$$svc:dev; \
	done
	docker tag gdg-pup-platform-dev-storybook $(DOCKER_ORG)/gdg-pup-platform-storybook:dev
	docker push $(DOCKER_ORG)/gdg-pup-platform-storybook:dev

push-staging:
	@echo "==> Rebuilding nexus-web with custom domain URLs..."
	NEXT_PUBLIC_NEXUS_API_URL=https://api.staging.$(DOMAIN) \
	NEXT_PUBLIC_IDENTITY_API_URL=https://identity.staging.$(DOMAIN) \
	$(COMPOSE) $(STAGING_ENV) $(BASE) -f docker-compose.staging.yml build nexus-web
	@echo "==> Tagging and pushing images..."
	@for svc in $(SERVICES); do \
		docker tag gdg-pup-platform-$$svc:gdg-pup-platform-staging $(DOCKER_ORG)/gdg-pup-platform-$$svc:staging; \
		docker push $(DOCKER_ORG)/gdg-pup-platform-$$svc:staging; \
	done
	docker tag gdg-pup-platform-staging-storybook $(DOCKER_ORG)/gdg-pup-platform-storybook:staging
	docker push $(DOCKER_ORG)/gdg-pup-platform-storybook:staging

push-prod:
	@echo "==> Rebuilding nexus-web with custom domain URLs..."
	NEXT_PUBLIC_NEXUS_API_URL=https://api.$(DOMAIN) \
	NEXT_PUBLIC_IDENTITY_API_URL=https://identity.$(DOMAIN) \
	$(COMPOSE) $(PROD_ENV) $(BASE) -f docker-compose.prod.yml build nexus-web
	@echo "==> Tagging and pushing images..."
	@for svc in $(SERVICES); do \
		docker tag gdg-pup-platform-$$svc:gdg-pup-platform-prod $(DOCKER_ORG)/gdg-pup-platform-$$svc:prod; \
		docker push $(DOCKER_ORG)/gdg-pup-platform-$$svc:prod; \
	done
	docker tag gdg-pup-platform-prod-storybook $(DOCKER_ORG)/gdg-pup-platform-storybook:prod
	docker push $(DOCKER_ORG)/gdg-pup-platform-storybook:prod

# ---- Common ----
.PHONY: down clean logs
down:
	$(COMPOSE) $(BASE) down

clean:
	$(COMPOSE) $(BASE) down --rmi all --volumes --remove-orphans

logs:
	$(COMPOSE) $(BASE) logs -f

# ---- Domain Mapping Status ----
# Usage: make domain-status ENV=dev
ENV ?= dev

DOMAIN_MAP_dev     = dev.gdgpup.org api.dev.gdgpup.org identity.dev.gdgpup.org
DOMAIN_MAP_staging = staging.gdgpup.org api.staging.gdgpup.org identity.staging.gdgpup.org
DOMAIN_MAP_prod    = gdgpup.org api.gdgpup.org identity.gdgpup.org

.PHONY: domain-status
domain-status:
	@echo "==> Checking domain mapping status for $(ENV)..."
	@for domain in $(DOMAIN_MAP_$(ENV)); do \
		echo "\n--- $$domain ---"; \
		gcloud beta run domain-mappings describe \
			--domain=$$domain \
			--region=$(REGION) \
			--project=$(PROJECT_ID) \
			--format="table(status.conditions.type,status.conditions.status,status.conditions.message)" 2>&1; \
	done

REGION     ?= asia-southeast1
PROJECT_ID ?= gdgpup-484914
