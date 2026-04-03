# CI/CD Conversation Context Summary

Date: 2026-04-03
Repository: gdg-pup-webdev/gdg-pup-platform

## Goal
Stabilize the release pipeline and make the promotion flow consistent:
1. CI Build & Test
2. Docker Build & Push
3. Deploy [Environment]

Target branch promotion flow:
1. feature branch -> dev
2. dev -> deploy-develop
3. deploy-develop -> staging
4. staging -> main

## Main Problems Encountered

### 1) Detect Changes step failed in Docker/Deploy workflows
Error observed:
- Can't find action.yml / action.yaml / Dockerfile under .github/workflows/ci.detect-changes

Root cause:
- ci.detect-changes.yml is a reusable workflow (workflow_call), but it was being used like a step-level local action.

Fix applied:
- Switched invocation to job-level reusable workflow call in:
  - .github/workflows/ci.docker-build-push.yml
  - .github/workflows/ci.deploy.yml

### 2) Docker build failure for nexus-web (module not found)
Error observed:
- Can't resolve ../../../../../nexus-admin-web/src/lib/constants/assets

Root cause:
- Cross-app source import from nexus-web into nexus-admin-web. This breaks in Docker prune/build context.

Fix applied:
- Replaced imports with local alias import in nexus-web:
  - apps/nexus-web/src/features/sparkmates/components/SparkmatesPortfolio.tsx
  - apps/nexus-web/src/features/profile/components/ProfileOwnerView.tsx
- New import used:
  - @/lib/constants/assets

### 3) Deploy did not run even when earlier workflows looked successful
Observed behavior:
- CI and Docker appeared successful, but Deploy did not trigger in expected release chain.

Root cause:
- PR-triggered CI runs (head branch dev) were still producing workflow_run events that triggered Docker runs in non-release context.
- These runs could appear successful while not representing merged release branch pushes.

Fixes applied:
- CI PR trigger narrowed to avoid deploy-develop preview path:
  - .github/workflows/ci.test.yml
  - pull_request branches changed to [staging, main]
- Docker gate tightened to only proceed from successful CI runs that came from push events on release branches:
  - .github/workflows/ci.docker-build-push.yml
  - detect-changes job if condition now requires:
    - workflow_run.conclusion == success
    - workflow_run.event == push
    - head_branch in deploy-develop/staging/main

### 4) Manual Deploy run showed skipped service jobs
Observed behavior:
- Detect Changes succeeded, but nexus-web and nexus-api deployment jobs were skipped.

Root cause:
- Selective deploy logic only runs service deploy jobs when paths-filter says service changed.
- Manual rerun keeps same payload; if no detected app/package changes, jobs stay skipped.

Fix applied:
- Added manual override input in Deploy workflow:
  - .github/workflows/ci.deploy.yml
  - workflow_dispatch input: force_deploy (boolean, default false)
- Updated deploy job conditions so workflow_dispatch can run services when force_deploy = true.

## Current Workflow Behavior (after fixes)

### CI Build & Test (.github/workflows/ci.test.yml)
- push: deploy-develop, staging, main
- pull_request: staging, main

### Docker Build & Push (.github/workflows/ci.docker-build-push.yml)
- Triggered by workflow_run from CI Build & Test (and manual workflow_dispatch)
- Only runs real build path when upstream CI run is:
  - event push
  - conclusion success
  - branch deploy-develop, staging, or main

### Deploy [Environment] (.github/workflows/ci.deploy.yml)
- Triggered by workflow_run from Docker Build & Push (and manual workflow_dispatch)
- Automatic runs remain selective by changed paths
- Manual runs can bypass selective filter with force_deploy = true

## Notes About Warnings Seen in Detect Changes
Warnings like below were observed and are non-fatal:
- Ref dev is not checked out - results might be incorrect
- before field is missing in event payload - changes will be detected from last commit

Reason:
- paths-filter is operating in workflow_call/workflow_run contexts with detached checkout and limited event payload fields.

## Operational Guidance
For release deployment validation:
1. Merge dev -> deploy-develop
2. Wait for push-based CI completion on deploy-develop
3. Confirm Docker follows from that push-based CI run
4. Confirm Deploy follows from that Docker run

For manual environment checks:
1. Run Deploy [Environment] manually
2. Set target_environment
3. Set force_deploy = true if you need to run deploy jobs even without path changes

## Files Updated During This Work
- .github/workflows/ci.test.yml
- .github/workflows/ci.docker-build-push.yml
- .github/workflows/ci.deploy.yml
- apps/nexus-web/src/features/sparkmates/components/SparkmatesPortfolio.tsx
- apps/nexus-web/src/features/profile/components/ProfileOwnerView.tsx
