# CI/CD and Setup Hardening Plan

**Project:** GDG PUP Platform (Nexus)

**Owner:** GDG PUP Technology

**Assessment date:** 2026-10-20

**Status:** Proposed implementation plan; fixes are not implemented

**Improvement register:** [FLAGS F5](../FLAGS.md), with related setup and Identity API limitations in F4 and F1

## Purpose and scope

Strengthen the existing pnpm, Turborepo, GitHub Actions, Docker, Cloud Run, and Supabase setup. Preserve the current architecture and make changes verifiable, releases traceable, and recovery repeatable.

This document consolidates the GitHub audit and its subsequent verification. Creating this document does not change workflows, repository settings, credentials, infrastructure, or databases. Production deployment remains a separate, explicitly authorized step.

Retain the Supabase Free plan and account for the user's stated USD 500 Google Cloud credits. Verify remaining credits and actual billing separately. This plan does not assume paid upgrades, new permanent environments, or additional hosting services. Measure resource needs before changing limits.

## Assessment baseline and limits

The audit inspected the public [GitHub repository](https://github.com/gdg-pup-webdev/gdg-pup-platform), live branch protections, environment protections, workflow history, selected PR checks, and repository configuration. The local `dev` HEAD matched the remote default branch at `68dd33763b6a3835769479cc5d67ee44088a7172` during the audit.

Observed GitHub state on the assessment date:

- Default branch: `dev`. Both `dev` and `main` require one approving review but no required status checks; administrator enforcement is disabled. `staging` and `deploy-develop` are unprotected.
- The `Prod Secrets` environment has no configured reviewer or deployment branch restrictions.
- The latest recorded CI Build & Test runs failed on 2026-09-02. The [latest failed run](https://github.com/gdg-pup-webdev/gdg-pup-platform/actions/runs/33649798476) returned no jobs, check runs, or retrievable logs. Its root cause is unresolved.
- The latest recorded Cloud Run deployment workflow [succeeded on 2026-05-13](https://github.com/gdg-pup-webdev/gdg-pup-platform/actions/runs/25787058571). This is historical evidence, not verification of today's deployed version or service health.
- There were 47 open PRs: 45 bot dependency updates and two human contributions. Selected Vercel checks showed authorization failures and deployment failures. Green scheduled scraper or housekeeping jobs do not establish application build/test success.
- `dev` was six commits ahead and 88 behind `main`. Reconcile release history before choosing a synchronization strategy.

Live Cloud Run configuration, GCP IAM, billing, deployed image digests, Supabase migration history, and backup/recovery readiness were not established by this audit. No new application tests, container executions, staging deployments, or rollback exercises were performed for this planning document. Refresh remote observations before implementation.

## Problems and evidence

| ID | Priority | Problem and consequence | Evidence |
| --- | --- | --- | --- |
| P1 | High | Build/test CI misses PRs into `dev` and pushes to `dev`. Normal development can enter the default branch without application validation. | [CI triggers](../.github/workflows/ci.test.yml) |
| P2 | High | Reviews are required on `dev` and `main`, but passing checks are not. Release branches and the production environment lack sufficient gates. | GitHub branch/environment settings observed on 2026-10-20 |
| P3 | High | Manual Docker dispatch uses the workflow's `github.sha` even when a different `head_branch` is supplied. Manual deploy accepts `test_ref`, but image selection receives only `triggered_sha`, falling back to a mutable environment tag when absent. The requested ref and deployed artifact can differ. | [Build workflow](../.github/workflows/ci.docker-build-push.yml), [deploy workflow](../.github/workflows/ci.deploy.yml), [deployment action](../.github/deployments/action.yml) |
| P4 | High | Manual dispatch bypasses the automatic successful-CI gate. The deployment trigger rejects failed builds but can accept cancelled builds. Concurrency includes the branch, allowing separate runs targeting one environment to overlap. | Build/deploy workflows |
| P5 | High | Production deployment is dispatched using `--ref dev`. Restricting its environment to `main` before correcting execution refs would block releases. | Build workflow dispatch step; GitHub environment restrictions match the run's ref |
| P6 | High | CI and application Dockerfiles use Node 20, which is end of life. Runtime alignment alone would preserve an unsupported runtime. | [CI action](../.github/tests/action.yml), application Dockerfiles, [Node lifecycle](https://nodejs.org/en/about/eol) |
| P7 | High | The production scraper executes default-branch code, installs unpinned dependencies, and accesses production secrets without a protected environment. | [Production scraper](../.github/workflows/auto.scrape-events-prod.yml), [development scraper](../.github/workflows/auto.scrape-events.yml) |
| P8 | Medium | CI runs build/test without explicit lint or separate type checking. Web/admin lack test scripts; package scripts and Turbo tasks need wiring. Identity API is intentionally excluded from standard validation. | CI action, [Turbo configuration](../turbo.json), app package scripts, [FLAGS F1](../FLAGS.md) |
| P9 | Medium | Health checks accept HTTP redirects and do not verify the release identity. Rollback selects the second-newest Ready revision instead of restoring recorded traffic. | Deployment action |
| P10 | Medium | Terraform and deployment workflows both manage images, environment variables, and traffic. The checked-in production remote-state backend is commented out. An apply could overwrite release changes; actual state storage remains unverified. | [Compute module](../terraform/modules/compute/main.tf), [production provider](../terraform/environments/prod/provider.tf) |
| P11 | Medium | Existing migrations coexist with manual schema-diff SQL. Automated application without reconciling remote history could replay or conflict with existing changes. | [Migrations](../supabase/migrations/), [schema-sync guide](../supabase/README_SCHEMA_SYNC.md) |
| P12 | Medium | Setup depends on organizer-provided environment values. API heap configuration permits 512 MB while deployment specifies a 512 MiB container, leaving insufficient guaranteed headroom for other process memory. Vercel preview failures remain unresolved. | [FLAGS F4](../FLAGS.md), [API Dockerfile](../apps/nexus-api/Dockerfile), deploy workflow, selected PR checks |

## Target behavior

Proposed branch flow: feature branches -> `dev` -> `staging` -> `main`. Confirm this against actual release history. Keep `deploy-develop` until its responsibilities have been migrated and validated. Do not blindly merge diverged branches or assume the newest branch contains the correct production baseline.

The intended delivery flow is:

1. Validate PRs without production credentials.
2. Revalidate the exact release commit after merge.
3. Build images from that commit and record immutable image digests.
4. Authorize deployment to the matching environment.
5. Deploy candidate revisions without production traffic and validate them directly.
6. Promote traffic, or retain/restore the previous working allocation.
7. Publish a release summary with source, checks, artifacts, revision, and outcome.

API images can be reused across environments when configuration is runtime-only. Next.js public configuration is compiled into images, so build environment-specific frontend artifacts from the validated source SHA and record each digest and configuration identity. Do not promise one frontend image can be promoted unchanged with the current build configuration.

## Implementation phases

### Phase 1: Establish the release and recovery baseline

- Map branches, domains, Vercel projects, Cloud Run services, and Supabase projects to their actual environments.
- Record serving image digests, revision names, traffic allocations, and available recovery procedures.
- Compare branch histories and confirm the promotion model and active application scope.
- Investigate failed CI; if historical logs remain unavailable, reproduce validation in an isolated run without deployment credentials.
- Inspect existing Terraform state and remote migration history using read-only operations.

**Exit criteria:** documented ownership and environment map; known serving artifacts; baseline discrepancies and unresolved access recorded. No branch retirement or infrastructure apply is needed to complete this phase.

### Phase 2: Establish complete, reproducible validation

- Choose a supported Node LTS release after testing compatibility with the lockfile, framework, native dependencies, and containers. Align CI, Docker, local configuration, and docs; keep pnpm explicitly pinned.
- Add maintained-application lint, type-check, build, unit/integration tests, and critical browser smoke checks. Wire package scripts and Turbo task dependencies rather than adding commands that execute no work.
- Run PR validation for `dev`, `staging`, and `main`, plus maintained transitional branches where applicable. Revalidate release pushes.
- Add a stable final `Required CI` job using `always()` and explicit dependency-result evaluation. Required work failing, cancelling, or unexpectedly skipping must fail the gate.
- Initially validate all maintained apps. Avoid workflow-level path filters on required checks. Introduce selective jobs only after testing shared-package changes, root lockfile/tooling changes, and explicitly allowed skips.
- Give PR jobs read-only permissions and safe test configuration. Fork and Dependabot PRs must not need production secrets or write production data.
- Add sanitized per-app environment templates and clean-machine setup instructions. Keep Identity API exclusions explicit until its ownership is resolved.

**Exit criteria:** clean installation and validation succeed; intentionally broken code blocks CI; documentation-only changes produce a completed gate; shared-package changes validate consumers; fork PR validation works without privileged credentials.

### Phase 3: Correct artifact identity and deployment execution

- Resolve approved refs to one full source SHA. Verify successful checks from the expected workflow for that release commit, including manual requests.
- Build from that SHA; record service, environment, source SHA, configuration identity, and pushed image digest. Deploy by digest and remove mutable-tag fallback.
- Reject inconsistent environment/ref/SHA combinations and arbitrary production refs. Execute trusted workflow/action code from the approved release context.
- Prefer reusable workflow calls or an explicit job dependency chain. If retaining dispatch, use narrowly scoped `GITHUB_TOKEN` permissions where feasible and verify event behavior before retiring `GH_PAT`.
- Require required builds to succeed; allow only explicitly intended skips. Cancelled builds must not trigger deployment.
- Serialize deployments by destination environment. Do not cancel a deployment midway through traffic changes. Validate multiple pending-release behavior rather than assuming concurrency is a FIFO queue.
- Check workflow syntax and dependency behavior, including failure, cancellation, and invalid manual inputs.

**Exit criteria:** the deployed digest matches the manifest and validated source; mismatched requests fail before deployment; two requests for one environment cannot mutate its traffic concurrently.

### Phase 4: Apply access controls and include scheduled jobs

- Once corrected checks exist and pass, require `Required CI` and review on maintained integration/release branches. Restrict direct pushes, dismiss stale approvals, and document a controlled emergency bypass.
- Correct production workflow execution refs before configuring production branch restrictions. Configure production reviewers and confirm reviewer availability before preventing self-approval. Scope sensitive build credentials as well as deployment credentials.
- Migrate deployment authentication to OIDC/Workload Identity Federation with trust restricted to the repository identity and approved deployment context. Scope `id-token: write` to jobs that need it. Verify the replacement before revoking existing keys.
- Keep deployment identity separate from application runtime identity. Review runtime storage credentials independently; replacing CI authentication does not replace application credentials.
- Pin third-party actions to reviewed full commit SHAs and retain dependency automation.
- Harden both scrapers: explicit trusted refs, environment-scoped secrets, locked dependency installation, distinct names, concurrency controls, and failure reporting. Production credentials must not remain available through an alternate unprotected scheduled path.
- Exclude generated authentication files from Git, Docker contexts, caches, and artifacts.

**Exit criteria:** ordinary PRs cannot obtain production credentials; unauthorized workflow refs cannot deploy; approved releases and scrapers still work with their scoped identities. Prove credential denial through controlled tests without exposing secrets.

### Phase 5: Prove deployment health and recovery

- Capture the existing traffic allocation before deployment. Create tagged candidate revisions with no production traffic and check the candidate URL directly.
- Add readiness and release identity checks. Require expected status/body and bounded retries; avoid accepting arbitrary redirects. Keep probes non-destructive and avoid exposing private configuration.
- Run member/admin smoke checks against safe test data before promotion. Define ordering and compatibility across API, web, and admin releases because multi-service promotion is not atomic.
- Promote traffic only after validation; retain or restore the exact recorded previous allocation on failure. Test the failure path in staging, including interrupted deployment recovery.
- Measure total API memory and container startup behavior. Adjust heap or resource configuration using observed headroom and cost limits.

**Exit criteria:** an unhealthy staging revision receives no promoted traffic; recovery restores the recorded allocation; the running service reports the expected release identity. Document cleanup of candidate tags and obsolete revisions.

### Phase 6: Reconcile infrastructure and database automation

- Establish reviewed Terraform ownership for infrastructure versus deployment-controlled image/configuration/traffic fields. Use that decision to prevent later applies from reverting releases.
- Locate existing state and migrate or import deliberately into a shared, access-controlled backend. Inspect the plan before applying; do not create replacement services based only on missing local state.
- Add Terraform formatting and validation. Generate credentialed plans only from trusted contexts; protect plan/state artifacts because they can contain sensitive values.
- Reconcile existing Supabase migrations with remote history and manual schema changes. Verify a disposable local database can be rebuilt before automating application to shared databases.
- Use backward-compatible expand/contract migrations. Apply required additive changes before application promotion, verify them, and postpone destructive cleanup until old revisions are retired.
- Verify recovery options supported by the actual Supabase plan. Application rollback does not automatically reverse database changes. Avoid automatically executing generated schema-diff SQL against production.

**Exit criteria:** infrastructure plans contain no unexplained replacements or release reversions; migration history is consistent; local rebuild and staging migration succeed; application rollback remains compatible with the updated schema.

### Phase 7: Repair previews and establish release visibility

- Decide which Vercel projects remain part of the supported preview flow and repair authorization/configuration accordingly. Identify the authoritative production host for each service.
- Isolate previews from production data and credentials. Use disposable local services or approved existing test resources within budget.
- Publish release summaries containing environment, source SHA, required-check run, image digest, revision, smoke results, traffic outcome, and rollback result.
- Configure failure notifications through an agreed channel when authorized. Triage dependency PRs in small validated groups instead of bulk merging.
- Update onboarding, operational runbooks, STATE where responsibilities change, and FLAGS as fixes are verified.

**Exit criteria:** previews are reproducible or explicitly retired; failures are actionable; maintainers can identify the serving release without reconstructing several workflow logs.

## Completion evidence

All items below are pending. Mark completion only with run links, reviewed configuration, or documented runtime results.

- [ ] Branch/environment map and serving-artifact baseline recorded.
- [ ] Supported runtime and frozen clean installation verified.
- [ ] Broken PR, cancelled required job, documentation-only PR, shared-package change, and fork PR scenarios validated.
- [ ] Required checks and branch protections block invalid merges.
- [ ] Manual and automatic releases deploy the expected source/configuration digests.
- [ ] Unauthorized deployment refs are denied and scheduled production work is protected.
- [ ] Concurrent release requests cannot overlap traffic mutation in one environment.
- [ ] Candidate readiness, release identity, promotion, and failure recovery exercised in staging.
- [ ] Terraform ownership/state and Supabase migration history reconciled.
- [ ] Preview isolation, setup instructions, resource headroom, and release summaries verified.

## References and revisit conditions

- [GitHub required-check behavior](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks)
- [GitHub environment protections and execution-ref matching](https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments)
- [GitHub token event behavior](https://docs.github.com/en/actions/concepts/security/github_token)
- [GitHub workflow security](https://docs.github.com/en/actions/reference/security/secure-use)
- [Google deployment-pipeline federation](https://docs.cloud.google.com/iam/docs/workload-identity-federation-with-deployment-pipelines)
- [Cloud Run candidate testing and traffic recovery](https://docs.cloud.google.com/run/docs/rollouts-rollbacks-traffic-migration)
- [Supabase migration history and deployment](https://supabase.com/docs/guides/deployment/database-migrations)

Revisit the plan if branch ownership, hosting, repository visibility, runtime compatibility, contributor access, database recovery options, event load, or available credits change. Verified implementation results take precedence over this dated assessment.
