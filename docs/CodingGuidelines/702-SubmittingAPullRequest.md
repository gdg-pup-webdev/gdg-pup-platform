**[🏠 Repository](../../README.md)** • **[📚 Onboarding](../Onboarding/README.md)** • **[📖 Coding Guidelines](./README.md)**

---

# 702 - Submitting a Pull Request

## Overview

Pull requests (PRs) are how we merge code changes into the codebase. Following this process ensures code quality and smooth collaboration.

## Pre-Submission Checklist

Before opening a PR, complete these steps:

### 1. Sync with `dev`

Update your `dev` branch and rebase to ensure your code is built on the latest changes.

```bash
# 1. Switch to dev and pull latest
git checkout dev
git pull origin dev

# 2. Switch back to your feature branch
git checkout <your-branch>

# 3. Rebase onto latest dev
git rebase dev
```

### 2. Run Tests

Make sure all tests pass before submitting.

```bash
# From the root of the repository
pnpm run test
```

**All tests must pass.** Fix any failing tests before proceeding.

### 3. Build the Project

Run the build command to ensure everything builds correctly for production.

```bash
pnpm run build
```

**The build must succeed** without errors.

---

## PR Title Convention

The PR title should be **readable and informative**. Follow the same convention as commit messages.

**Format:** `<type>(<scope>): <brief description>`

**Example:**
```
feat(nexus-api): implement achievement tier validation
```

See **[704 - Commit Conventions](./704-CommitConventions.md)** for details on types and scopes.

### Title Examples

✅ **Good Titles:**
- `feat(nexus-web): add event registration form`
- `fix(identity-api): resolve token expiration bug`
- `refactor(nexus-api): restructure user service using layered architecture`
- `docs(repository): update onboarding guide with troubleshooting steps`

❌ **Bad Titles:**
- `Fixed stuff` (too vague)
- `Update` (no context)
- `Made changes to the user service` (missing type and scope)

---

## PR Body Format

The PR body should provide context for reviewers. Use the following structure:

### 1. Related Issue

Link the issue so it automatically closes when merged.

**Format:**
- `Closes #102`
- `Fixes #65`
- `Resolves #234`

**Example:**
```markdown
## Related Issue
Closes #102
```

**Note:** Using keywords like `Closes`, `Fixes`, or `Resolves` will automatically close the linked issue when the PR is merged.

### 2. Summary

Provide a **high-level explanation** of the changes.

- **Why** was this PR created?
- **What** does it accomplish?

**Example:**
```markdown
## Summary
This PR introduces logic for validating user achievement tiers based on
the new contract specifications in nexus-api. Previously, tier validation
was missing, allowing invalid tiers to be assigned to users.
```

### 3. Strategies

Explain **important strategies and decisions** involved in the pull request.

- Technical approaches taken
- Design decisions made
- Explanations for any deviations from coding guidelines (see **[501 - The Grey Area](./501-TheGreyArea.md)**)

** Example:**
```markdown
## Strategies
- Used a middleware approach for tier validation to keep controllers lightweight
- Implemented caching for tier calculations to improve performance
```

### 4. Additional Information

Provide **any additional context** that could be useful for the reviewer.

- Breaking changes
- Migration steps required
- Known limitations or follow-up work
- Screenshots/videos for UI changes

**Example:**
```markdown
## Additional Information
- ⚠️ **Breaking Change**: The `UserTier` type now requires explicit values
- Migration: Existing users will need tier recalculation (run `pnpm run migrate:tiers`)
- Follow-up: Add tier history tracking (tracked in #234)
```

---

## Complete PR Example

**Title:** `feat(nexus-api): implement user achievement tier validation`

**Body:**
```markdown
## Related Issue
Closes #102

## Summary
This PR adds validation logic for user achievement tiers in nexus-api.
Previously, users could be assigned invalid tiers, causing inconsistencies
in the achievement system.

## Strategies
- Implemented tier validation middleware to centralize logic
- Added caching layer for tier calculations using Redis
- Tier calculations run async to avoid blocking the main request thread

## Additional Information
- All existing tests pass
- Added 12 new test cases for tier validation edge cases
- Tested with 10K users in staging environment
```

---

## After Submitting

### Code Review

- Address reviewer feedback promptly
- Push new commits to the same branch (they'll appear in the PR automatically)
- Respond to comments explaining your changes

### Final Merge

Once approved:
- **Squash commits** if there are many small commits
- **Merge** using the "Squash and merge" button on GitHub
- **Delete the branch** after merging

---

## Related Guidelines

- **[701 - Opening an Issue](./701-OpeningAnIssue.md)** – Creating issues that PRs reference
- **[703 - Naming Your Branches](./703-NamingYourBranches.md)** – Branch naming conventions
- **[704 - Commit Conventions](./704-CommitConventions.md)** – Commit message format
- **[501 - The Grey Area](./501-TheGreyArea.md)** – Documenting deviations in PRs

---

**[🏠 Repository](../../README.md)** • **[📚 Onboarding](../Onboarding/README.md)** • **[📖 Coding Guidelines](./README.md)**
