# CI/CD and Setup Improvement Sequencing

Status: Proposed sequencing; fixes are not implemented.
Companion to: [cicd-and-setup-hardening-plan.md](cicd-and-setup-hardening-plan.md) (the "first plan," problems P1 to P12, phases 1 to 7).
Related: [FLAGS.md](../FLAGS.md) F5, F4, F1.

## Purpose

The first plan (the hardening plan above) catalogs the problems correctly and sequences fixes so later phases do not depend on earlier bugs. This document does not replace it. It re-sequences the same problems for execution by a small, mostly-volunteer maintainer team, where the binding constraint is not technical risk but who is available to do the work and review it.

## Validation note

Before using the first plan as a baseline, re-pull live counts. A spot check on 2026-10-20 found the plan's stated "47 open PRs: 45 bot, two human" does not match live state (30 open: 29 Dependabot, 1 human, PR #1416). No PRs were closed between 2026-10-15 and 2026-10-20 that would explain the gap. Every other checked claim in the first plan (dev HEAD SHA, dev/main divergence count, the forced `--ref dev` dispatch bug, the unprotected production scraper, branch protection shape) matched live state exactly. Treat the PR count as stale and re-pull it before marking Phase 1's baseline complete.

## Sequencing principle

Group fixes by who must act and how reversible the change is, not only by dependency order. A fix that one person can land and revert alone should happen before a fix that requires coordinating reviewers, rotating credentials, or touching infrastructure state.

## Tier 1: Safe to do now, single maintainer, no coordination needed

1. **Add `dev` to `ci.test.yml` trigger branches.** One-line change. Nothing currently runs CI on the branch everything merges into; every other fix in this document assumes CI exists on `dev` first.
2. **Pin Node version across workflows to match `apps/nexus-api/Dockerfile` and `packages/*` engines.** `auto.scrape-events-prod.yml` runs Node 22 while other workflows differ; align them so "it passed CI" means something closer to "it will behave the same in prod."
3. **Pin the production scraper's checkout `ref` and replace the ad-hoc `npm install` with `npm ci` against a committed lockfile.** Removes the two cheapest-to-fix parts of P7 without touching secrets or environments.

Do these first. They are reversible, need no second approver, and raise the floor under every later phase.

## Tier 2: Fixes correctness bugs in the deploy path itself

4. **Fix the SHA-fallback bug (P3):** manual dispatch must pass `test_ref` through to `commit-sha`, or the deploy action must stop silently falling back to the mutable `:environment` image tag. Without this, "deploy this exact commit" is not guaranteed.
5. **Fix the forced `--ref dev` in `trigger-deploy` (P5):** the dispatch call must target the branch that matches the environment being deployed, not always `dev`. This must land before Tier 3's branch restrictions, because a branch restriction on the Prod environment would otherwise break every prod deploy outright (the workflow always executes from `dev`'s copy of the YAML regardless of target).

These two are deploy-correctness bugs, not hardening. They mean a human can reasonably believe a specific commit went to prod when a different one did. Treat them as higher priority than any access-control work.

## Tier 3: Needs a second person (reviewer or environment admin)

6. **Add a required reviewer to the `Prod Secrets` and `Production` GitHub Environments.** Needs someone other than the person deploying to be available to approve, at least nominally. Only safe once Tier 2 is done.
7. **Add branch restrictions to `main`/`Production` environment and enable `required_status_checks` on `dev`/`main`.** Same dependency: do this after Tier 2, not before.
8. **Protect `staging` and `deploy-develop`** to the same baseline as `dev`/`main` once Tier 1 proves CI is stable on `dev`.
9. **Scope the production scraper's secrets to the `Prod Secrets` environment** instead of plain repo secrets, now that environment has a reviewer gate (Tier 3.6) and the ref is pinned (Tier 1.3).

## Tier 4: Defer unless prod incidents or compliance force the timeline

10. Immutable image digests end-to-end (replacing mutable `:environment` tags everywhere, not just the fallback case).
11. OIDC / Workload Identity Federation migration off long-lived GCP service-account keys.
12. Terraform GCS remote-state backend migration (`terraform/environments/*/provider.tf` currently has the backend block commented out, defaulting to local state) and the `terraform/modules/network` empty-stub cleanup.
13. Supabase migration tooling to replace manual schema-diff SQL reconciliation.
14. Dependabot backlog triage in small validated groups, once CI exists on `dev` to validate against (this is the first plan's Phase 7, correctly sequenced last there too).

Tier 4 items are real but each carries either infrastructure risk (state migration, credential rotation) or ongoing process cost (backlog triage) that outweighs its urgency for a chapter platform at this stage. Pick these up only when prompted by an actual incident, an audit requirement, or when Tiers 1 to 3 are fully closed and someone has standing bandwidth.

## Key differences from the first plan

The first plan (`cicd-and-setup-hardening-plan.md`) was produced by Codex against the same repo and GitHub state. Its problem catalog (P1 to P12) and factual findings were independently re-verified here and hold up, with the one exception noted above (stale PR count). The two documents differ in organizing principle and scope, not in diagnosis:

| Axis | First plan (Codex) | This document |
| --- | --- | --- |
| Organizing axis | 7 phases, ordered by technical dependency (fix refs/digests before access controls, etc.) | 4 tiers, ordered by who has to act and how reversible the change is |
| Unit of sequencing | A phase bundles several unrelated problems that happen to be dependency-safe together (e.g., Phase 3 mixes digest-pinning with the ref bug) | A tier groups only problems with the same actor/coordination requirement, even if that splits a first-plan phase across tiers |
| Deploy-correctness bugs (P3, P5) | Embedded inside Phase 3, after Phase 1 (baseline) and Phase 2 (CI-on-dev) | Pulled into their own tier (Tier 2), immediately after the single-maintainer fixes and before any access-control work, since they are correctness bugs, not hardening |
| OIDC / Workload Identity Federation | A numbered phase (Phase 4) with its own exit criteria, implying a committed timeline | Moved to the deferred tier; treated as real but not worth scheduling until an incident, audit, or dedicated bandwidth makes it urgent |
| Terraform remote-state migration | A numbered phase (Phase 6), sequenced with Supabase migration tooling | Same deferral logic as OIDC; grouped with Supabase tooling in the deferred tier for the same reason: it is infrastructure-state risk with no current owner, not a scheduled project |
| Dependabot backlog triage | Phase 7, last, because it needs CI on `dev` to validate against | Also last (Tier 4.14), for the same reason; this is the one item where both documents agree on both the reasoning and the position |
| Assumed staffing | Implicitly assumes a team that can execute 7 phases in order over time | Explicitly assumes a single incoming-CTO-equivalent maintainer per [AGENTS.md](../AGENTS.md) ownership note, and treats "needs a second reviewer" as a real blocker, not a formality |
| Exit criteria granularity | Per-phase, broad (e.g., "Phase 2 complete when CI passes on dev") | Per-tier, with the specific `gh api` / revision-digest checks needed to verify each one without re-deriving them |

Net effect: nothing in the problem list changed. What changed is that deploy-correctness bugs now sit ahead of every environment/access-control change (closing the gap where a branch restriction could have been added before the `--ref dev` bug was fixed, which would have broken prod deploys outright), and two phases that read as near-term commitments in the first plan (OIDC, Terraform backend) are explicitly marked as unscheduled until there is a concrete trigger to pick them up.

## Exit criteria per tier

- **Tier 1 done** when `ci.test.yml` runs and passes on a `dev` push, Node versions match across workflows and Dockerfiles, and the scraper runs `npm ci` against a committed lockfile with a pinned ref.
- **Tier 2 done** when a manual dispatch with an explicit `test_ref` deploys that exact commit's image (verified by comparing the deployed revision's image digest to the commit's build artifact), and a staging-environment manual dispatch via `trigger-deploy` executes from the staging branch's workflow copy, not `dev`'s.
- **Tier 3 done** when `gh api repos/.../environments` shows a non-empty `reviewers` array on `Prod Secrets` and `Production`, and `gh api repos/.../branches/{dev,main,staging,deploy-develop}/protection` all return a protection object with `required_status_checks` set.
- **Tier 4** has no shared exit criteria; each item defines its own when picked up.
