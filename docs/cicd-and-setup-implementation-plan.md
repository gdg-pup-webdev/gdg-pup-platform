# CI/CD and Setup Implementation Plan

Status: Proposed; execution has not started. Nothing in this plan runs until the user gives an explicit go-ahead per tier.
Executes: [cicd-and-setup-improvement-sequencing.md](cicd-and-setup-improvement-sequencing.md) (the tiered re-sequencing of [cicd-and-setup-hardening-plan.md](cicd-and-setup-hardening-plan.md)).
Related: [FLAGS.md](../FLAGS.md) F5, F4, F1.

## Ground rules (apply to every tier)

1. **Nothing lands on `dev`, `staging`, `main`, or `deploy-develop` directly.** Every change in this plan goes through a feature branch and a PR, even for a one-line YAML edit. This is the single biggest protection against an accident: a PR can be reviewed, diffed, and closed without ever having touched a protected branch.
2. **No step deploys to Production.** Every verification step in this plan either runs in CI only, targets a disposable/staging environment, or is a dry-run (`gh workflow run` with `--dry-run` where supported, or inspecting `gh run view` output without merging). The plan does not touch the `Production` or `Prod Secrets` GitHub Environments until Tier 3, and even then it only adds a reviewer gate, never dispatches a deploy.
3. **Nothing in Tier 1 or Tier 2 touches application code, `packages/*-api-contracts`, Terraform, or the database.** The entire plan is confined to `.github/workflows/*.yml`, `.github/*/action.yml`, and `package.json`/`.nvmrc`-style version pins. If a step would touch anything outside `.github/` or a version-pin file, it is out of scope for this plan and belongs in Tier 4 or a separate plan.
4. **Every tier ends with a stop-and-report, not an auto-continue.** After each tier's steps are verified, report status and wait for the next go-ahead. This plan does not assume Tier 1 approval implies Tier 2 approval.
5. **Every tier has a one-command revert.** Each step below lists the exact revert action before it lists the change itself is considered "safe to attempt."

## Pre-flight (run once, before Tier 1, read-only)

These commands only read state. They confirm the baseline this plan is executing against is still accurate before changing anything.

```bash
git fetch origin
git rev-parse origin/dev                                   # confirm current dev HEAD
git rev-list --left-right --count origin/dev...origin/main  # confirm divergence
gh pr list --state open --json number,author,title          # re-pull live PR count (sequencing doc flagged this as stale)
gh api repos/gdg-pup-webdev/gdg-pup-platform/branches/dev/protection --jq 'has("required_status_checks")'  # expect false: dev/main ARE protected (1 required review, push restricted to Core+DevOps teams) but have NO required status checks yet — the status-check gap is what Tier 3 closes
gh api repos/gdg-pup-webdev/gdg-pup-platform/environments     # confirm Prod Secrets / Production reviewer state (expect 0 protection rules)
```

Reconciled 2026-10-22: `dev`/`main` already carry branch protection (required PR review + team push restriction), so the "nothing lands directly on protected branches" ground rule is platform-enforced, not just convention. What is genuinely missing and in-scope for Tier 3 is (a) `required_status_checks` on dev/main and (b) reviewer gates on the `Prod Secrets`/`Production` environments. The executing maintainer (`kianflorendo`) is a repo admin with `enforce_admins: false`, so Tier 1/2 PRs can be self-merged without a second reviewer.

Report the refreshed numbers before starting Tier 1. If anything drifts from THIS reconciled baseline (e.g., required_status_checks suddenly present, or env reviewers already set), stop and reconcile again before proceeding.

---

## Tier 1 — Safe, single-maintainer, no coordination needed

**Branch:** `chore/ci-hardening-tier-1` (matches the repo's live convention — `chore/*` is the dominant real-world prefix for CI/infra/maintenance branches here, not the `enhance/`/`refactor/` patterns from the written guideline).
**Touches:** `.github/workflows/ci.test.yml`, `.github/workflows/auto.scrape-events-prod.yml`, possibly a new `.nvmrc` or `engines` field.
**Cannot affect prod because:** none of these files are referenced by the deploy workflow (`ci.deploy.yml`) or the deploy action (`.github/deployments/action.yml`). Changing them changes what CI runs and what the scraper does on its next scheduled execution — nothing that serves live traffic.

### Step 1.1 — Add `dev` to `ci.test.yml` triggers

Change:
```yaml
on:
  push:
    branches: [deploy-develop, staging, main]
  pull_request:
    branches: [staging, main]
```
to:
```yaml
on:
  push:
    branches: [dev, deploy-develop, staging, main]
  pull_request:
    branches: [dev, staging, main]
```

**Verify before merging:** push the branch, confirm the `test` job appears and passes in `gh run list --branch chore/ci-hardening-tier-1`. Open the PR against `dev` (per `702-SubmittingAPullRequest.md`'s sync-with-dev convention) — this PR itself will be the first real test, since GitHub evaluates the *base* branch's `pull_request` trigger using the workflow file already on `dev`. Expect this specific PR not to trigger CI (the old workflow is still on `dev` until merge) — that is expected, not a failure. CI starts running on the *next* PR into `dev`, after merge. Squash and merge per the repo's documented PR convention.

**Revert:** `git revert` the merge commit, or re-open a one-line PR removing `dev` from the branch lists. No infrastructure state involved.

### Step 1.2 — Pin Node version across workflows

Read `apps/nexus-api/Dockerfile`'s Node base image tag and any `engines.node` in root `package.json` first; use that exact version (not "latest LTS") in every `actions/setup-node@v4` step across `.github/workflows/*.yml` and `.github/tests/action.yml` so CI's Node version matches what actually runs in the container.

**Verify before merging:** CI must still pass with the pinned version — if it doesn't, that's the pin surfacing a real version-sensitivity bug, worth noting but not blocking this specific change (report it, don't silently work around it).

**Revert:** revert the version string in each file; no state.

### Step 1.3 — Pin scraper ref and switch to `npm ci`

In `auto.scrape-events-prod.yml`:
```yaml
- name: Checkout repository
  uses: actions/checkout@v4
  with:
    ref: main   # or whichever branch is the intended source of truth for scheduled jobs
```
Replace `npm install @supabase/supabase-js tsx dotenv` with a committed `package.json`/`package-lock.json` for the scraper (or reuse the root lockfile if the scraper's deps are already in it) and `npm ci`.

**Verify before merging:** trigger the workflow manually via `gh workflow run auto.scrape-events-prod.yml` from the PR branch (safe — it's a `workflow_dispatch`-enabled workflow; confirm it still completes successfully against the pinned ref). This does touch prod data (it's the real scraper hitting real Supabase prod secrets) — if you want zero prod-data risk during verification, skip the manual trigger and rely on code review plus the next scheduled run instead; flag this tradeoff before running it.

**Revert:** revert the ref pin and lockfile change; scraper falls back to prior (floating) behavior.

### Tier 1 exit check

```bash
gh run list --branch dev --workflow "CI Build & Test" --limit 1   # must show a run, not empty
```
Report status. **Stop here and wait for go-ahead before Tier 2.**

---

## Tier 2 — Deploy-correctness bugs (the one tier that touches the deploy path)

**Branch:** `chore/ci-hardening-tier-2`
**Touches:** `.github/workflows/ci.deploy.yml`, `.github/deployments/action.yml`, `.github/workflows/ci.docker-build-push.yml`.
**Note on the real promotion flow:** live PR history shows code reaches `staging`/`main` via manually-opened merge PRs along `dev → deploy-develop → staging → main` (e.g. past PRs titled "chore: deploy to staging", "chore: release to prod"), not a direct dev-to-main dispatch. The `trigger-deploy` job's bug (always dispatching `--ref dev`) is worse under this real flow than it looks in isolation: a build promoted to `staging` should dispatch using `staging`'s workflow copy, not `dev`'s. Verify Step 2.2 against an actual `deploy-develop → staging`-style promotion, not an arbitrary disposable branch, so the test matches how a release actually happens here.
**This is the highest-risk tier in the plan.** It edits the files that execute an actual deploy. The safety gate here is not "this can't affect prod" — it's "verify against staging before this code is ever exercised against prod."

### Step 2.1 — Fix the SHA-fallback bug (P3)

In `ci.deploy.yml`, ensure the manual-dispatch path always resolves a concrete SHA before calling the deploy action — pass `triggered_sha || test_ref` resolved to a commit SHA via `git rev-parse`, not left to the deploy action's own fallback. In `.github/deployments/action.yml`, remove or fail loudly on the implicit fallback to the mutable `:environment` tag instead of silently using it.

**Verify before merging — staging only:**
```bash
gh workflow run ci.deploy.yml --ref chore/ci-hardening-tier-2 \
  -f target_environment=staging -f triggered_branch=chore/ci-hardening-tier-2
gh run watch <run-id>
```
Then confirm the deployed Cloud Run revision's image digest matches the digest built from that exact commit:
```bash
gcloud run revisions describe <revision> --region <region> --format="value(spec.containers[0].image)"
```
Compare against the image pushed by the corresponding `ci.docker-build-push.yml` run for the same commit SHA. They must match exactly. **Do not run this dispatch with `target_environment=prod` during verification.**

**Revert:** revert the PR; the prior (buggy but known) fallback behavior returns. No Cloud Run resources are deleted or recreated by this change — it only affects which image tag gets referenced on the *next* deploy.

### Step 2.2 — Fix the forced `--ref dev` in `trigger-deploy` (P5)

In `ci.docker-build-push.yml`, the `trigger-deploy` job currently runs:
```bash
gh workflow run ci.deploy.yml --repo ... --ref dev
```
Change `--ref dev` to use the branch that triggered the build (`${{ github.event.workflow_run.head_branch }}` or equivalent, matched to the target environment).

**Verify before merging — staging only:** push a commit to a disposable branch that mimics `staging`'s trigger path, confirm `gh run view` on the dispatched `ci.deploy.yml` run shows it executed from that branch's copy of the workflow (check the run's "workflow file" reference in the UI or via `gh api repos/.../actions/runs/<id>` — `head_branch` and `path` should reflect the non-`dev` branch, not `dev`).

**This step must not be tested by actually dispatching against `main`/Production during verification.** Staging is the ceiling for live-fire testing in this tier.

**Revert:** revert the PR; dispatch reverts to always targeting `dev`'s copy (restores the bug, but restores known behavior rather than an unverified new one).

### Tier 2 exit check

Re-run the Tier 2 exit criteria from the sequencing doc: a staging dispatch with an explicit `test_ref` deploys that exact commit (digest match confirmed), and the dispatch executes from the target branch's workflow copy. Report status with the digest comparison evidence. **Stop here and wait for go-ahead before Tier 3. Do not proceed to a live Production dispatch as part of "verifying" this tier — Production verification happens naturally on the next real release, observed, not forced.**

---

## Tier 3 — Access controls (GitHub settings, not code)

**No branch/PR needed** — these are repository and environment settings applied via `gh api` or the GitHub UI, not file changes. **Cannot affect the codebase at all**; the only operational risk is locking out merges if applied before Tier 1 is confirmed stable.

### Step 3.1 — Required reviewer on `Prod Secrets` / `Production` environments

```bash
gh api -X PUT repos/gdg-pup-webdev/gdg-pup-platform/environments/Production \
  -f reviewers[][type]=User -f reviewers[][id]=<maintainer-user-id>
```
**Verify:** `gh api repos/.../environments/Production` shows non-empty `reviewers`.
**Revert:** `PUT` again with an empty `reviewers` array.

### Step 3.2 — `required_status_checks` on `dev`/`main`

Only apply once Tier 1's exit check (Step above) has shown multiple consecutive green runs on `dev` — not just one. A single green run could be luck; require at least 3 to 5 consecutive passes before gating merges on it.

```bash
gh api -X PUT repos/gdg-pup-webdev/gdg-pup-platform/branches/dev/protection \
  -f required_status_checks[strict]=true -f required_status_checks[contexts][]="Build & Test"
```
**Verify:** attempt a trivial PR into `dev`, confirm the check is required and blocks merge until green.
**Revert:** `DELETE repos/.../branches/dev/protection` removes the gate entirely if it locks out legitimate work.

### Step 3.3 — Protect `staging`/`deploy-develop`

Same mechanism as 3.2, applied to the other two branches, once Tier 1/2 fixes are confirmed stable on `dev`/`main`.

### Step 3.4 — Scope scraper secrets to `Prod Secrets` environment

Add `environment: Prod Secrets` to the scraper job in `auto.scrape-events-prod.yml` (small PR, same branch/PR discipline as Tier 1), only after Step 3.1's reviewer gate exists — otherwise this step does nothing protective.

### Tier 3 exit check

```bash
gh api repos/.../environments --jq '.environments[] | {name, reviewers}'
gh api repos/.../branches/dev/protection
gh api repos/.../branches/main/protection
```
Report status. **Stop here — Tier 4 is explicitly deferred, not scheduled. Do not start Tier 4 items without a separate, explicit request, since they carry real infrastructure/credential risk the earlier tiers don't.**

---

## What this plan deliberately does not do

- It does not touch Terraform state, GCP IAM/service-account keys, or Supabase schema. Those are Tier 4 and stay out of scope until specifically requested.
- It does not merge or close any of the 29 open Dependabot PRs. That's Tier 4.14, sequenced after CI exists on `dev` to validate them against.
- It does not run any step against the `Production` environment as "verification" — Production is only ever touched by a real, intentional release, after the fact, not as a test of this plan.

## Completion evidence checklist

- [ ] Pre-flight baseline re-pulled and reconciled against the sequencing doc
- [ ] Tier 1 merged, `dev` push triggers CI, 3+ consecutive green runs observed
- [ ] Tier 2 merged, staging dispatch digest-verified, `trigger-deploy` ref fix confirmed via non-`dev` branch dispatch
- [ ] Tier 3 applied, reviewer arrays and branch protection confirmed via `gh api`
- [ ] FLAGS.md F5 updated to reflect Tiers 1 to 3 closed, Tier 4 still open and explicitly deferred
