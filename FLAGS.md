# FLAGS

Improvement register for this repository. Documentation handover only - do not treat Open rows as bugs fixed in the docs PR.

Status: **Open** (actionable later) or **Accepted** (known limitation).


| ID | Severity | Finding | Evidence | Suggested next step | Status |
| --- | --- | --- | --- | --- | --- |
| F1 | Medium | ``identity-api`` (and its contracts) are excluded from default ``pnpm`` dev/build/start/lint/test scripts. | Root ``package.json`` filters | Confirm whether identity remains in-tree dead code, a separate deploy path, or should be re-enabled; document the decision in STATE. | Open |
| F2 | Low | Dual agent entrypoints: root ``GEMINI.md`` plus new ``AGENTS.md``. | ``GEMINI.md``, ``AGENTS.md`` | Keep AGENTS as load order; trim or point GEMINI from AGENTS to avoid conflicting instructions. | Open |
| F3 | Low | README had duplicated Quick Start / footer lines at handover. | ``README.md`` | Keep README reconciled; avoid reintroducing duplicate boilerplate. | Accepted |
| F4 | Medium | Local setup still depends on organizers for env vars (no checked-in template called out in README). | README Quick Start step 3 | Add a safe ``.env.example`` inventory (names only) when secrets owners allow. | Open |
| F5 | High | CI/CD and setup need stronger validation, artifact identity, production access controls, scheduled-job isolation, and recovery. Infrastructure ownership and database history need reconciliation before automation. | GitHub audit dated 2026-10-20; [problems and implementation plan](docs/cicd-and-setup-hardening-plan.md); re-sequenced by actor/reversibility in [tiered sequencing doc](docs/cicd-and-setup-improvement-sequencing.md); step-by-step execution in [implementation plan](docs/cicd-and-setup-implementation-plan.md) | Implement Tier 1 first (single-maintainer, reversible fixes), then Tier 2 (deploy-correctness bugs) before any environment access-control change. Execution is PR-gated per the implementation plan; no step targets Production as verification. Attach verification evidence before closing. Related setup and Identity API scope remain tracked in F4 and F1. | Open |
