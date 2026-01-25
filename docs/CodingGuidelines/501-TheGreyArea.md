**[🏠 Repository](../../README.md)** • **[📚 Onboarding](../Onboarding/README.md)** • **[📖 Coding Guidelines](./README.md)**

---

# 501 - The Grey Area

## Overview

These coding guidelines are designed to maintain a scalable codebase. However, **not every situation fits perfectly within the guidelines**. This document explains when and how to deviate from standards.

## Core Principle

**Guidelines are not absolute rules.** They exist to serve the codebase, not to constrain good engineering judgment.

## When to Deviate

There are cases where following the standard guidelines may not be the best approach for a specific situation:

- Performance optimizations required for production bottlenecks
- Working around known library bugs or limitations
- Temporary solutions during rapid prototyping or emergency fixes
- Legacy code integration that requires non-standard patterns

## Guidelines for Deviation

### 1. Use Best Judgment

When you encounter a situation where the normal conventions don't work well:

- ✅ **Consult** with your direct supervisor or team lead
- ✅ **Evaluate** the long-term impact on the codebase
- ✅ **Consider** if the issue reveals a gap in our guidelines
- ✅ **Document** your reasoning thoroughly

### 2. Document Your Reasoning

**This is mandatory.** If you deviate from coding guidelines, you **MUST** document:

- **Why** the standard approach doesn't work
- **What** alternative approach you're using
- **Why** this alternative is better for this specific case
- **Any** potential risks or technical debt introduced

### 3. Propose Guideline Updates

If you find a recurring pattern where deviations are necessary, consider proposing an update to the guidelines themselves. See **[601 - Updating the Coding Guidelines](./601-UpdatingTheCodingStandards.md)**.

## Examples


## Communication is Key

**Before deviating:**
1. Discuss with your team lead or supervisor
2. Document the decision in code comments
3. Add a TODO or FIXME if this is temporary

**During code review:**
1. Explicitly call out deviations in the PR description
2. Explain your reasoning in the "Strategies" section
3. Link to related discussions or decisions


---

## Related Guidelines

- **[601 - Updating the Coding Guidelines](./601-UpdatingTheCodingStandards.md)** – Proposing guideline changes
- **[504 - Documenting Your Code](./504-DocumentingYourCode.md)** – How to document unusual code
- **[702 - Submitting a Pull Request](./702-SubmittingAPullRequest.md)** – Explaining deviations in PRs

---

**[🏠 Repository](../../README.md)** • **[📚 Onboarding](../Onboarding/README.md)** • **[📖 Coding Guidelines](./README.md)**
