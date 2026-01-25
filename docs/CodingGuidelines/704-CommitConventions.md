**[🏠 Repository](../../README.md)** • **[📚 Onboarding](../Onboarding/README.md)** • **[📖 Coding Guidelines](./README.md)**

---

# 704 - Commit Conventions

## Overview

Our commit messages strictly follow the **Conventional Commits** standard for consistency and automated tooling support.

**Learn more:** [conventionalcommits.org](https://www.conventionalcommits.org/en/v1.0.0/)

## Commit Message Format

**Structure:** `<type>(<project>): <description>`

### Components

| Component | Description | Required |
|-----------|-------------|----------|
| `<type>` | What you did generally to the codebase | ✅ Yes |
| `(<project>)` | Name of the project mostly affected | ✅ Yes |
| `<description>` | Summary of the change | ✅ Yes |

---

## Commit Types

Use these standard commit types:

| Type | When to Use | Example |
|------|-------------|---------|
| `feat` | A new feature for the user | `feat(nexus-web): add event registration form` |
| `fix` | A bug fix (matches `bug/` or `hotfix/` branches) | `fix(nexus-api): resolve user validation error` |
| `enhance` | An improvement to existing code | `enhance(nexus-web): improve search performance` |
| `refactor` | Code change that neither fixes a bug nor adds a feature | `refactor(nexus-api): restructure user service` |
| `docs` | Documentation changes only | `docs(repository): update README with setup steps` |
| `chore` | Maintenance tasks (dependency updates, config changes) | `chore(nexus-api): update dependencies` |
| `release` | Release commits used to bump versions | `release(nexus-api): v1.2.0` |

---

## Project Scopes

The `<project>` should match one of our monorepo packages:

| Scope | Description |
|-------|-------------|
| `repository` | Root-level changes (CI/CD, configs, global docs) |
| `nexus-api` | Nexus backend service |
| `nexus-web` | Nexus frontend application |
| `identity-api` | Identity/authentication service |
| `nexus-api-contracts` | Nexus API contracts package |
| `identity-api-contracts` | Identity API contracts package |
| `typed-rest` | Typed REST utility package |

---

## Description Guidelines

- **Use imperative mood**: "add feature" not "added feature" or "adds feature"
- **Keep it concise**: 50-70 characters
- **No period** at the end

### Examples

✅ **Good Descriptions:**
- `add user registration validation`
- `fix event capacity check bug`
- `improve database query performance`
- `update API documentation for auth endpoints`

❌ **Bad Descriptions:**
- `added stuff` (past tense, vague)
- `Fixes.` (has period)
- `this commit updates the user service to use the new layered architecture pattern` (too long)

---

## Complete Examples

### Feature Commits
```
feat(nexus-web): add event search functionality
feat(nexus-api): implement tier-based pricing
feat(nexus-api-contracts): add event registration contract
```

### Bug Fix Commits
```
fix(nexus-api): prevent duplicate event registrations
fix(nexus-web): resolve form validation error
fix(identity-api): correct token expiration logic
```

### Refactor Commits
```
refactor(nexus-api): extract validation logic to utilities
refactor(nexus-web): reorganize component file structure
```

### Documentation Commits
```
docs(repository): add troubleshooting guide
docs(nexus-api): update API endpoint documentation
docs(repository): revise coding guidelines structure
```

### Chore Commits
```
chore(nexus-api): upgrade Express to v5
chore(repository): update ESLint configuration
chore(nexus-web): bump React version
```

---

## Special Cases

### Merge Commits

When pulling changes from remote or another branch, simplify the commit message:

```
merge: <branch-name>
```

**Examples:**
```
merge: dev
merge: feat/user-registration-#102
```

### Breaking Changes

For commits with breaking changes, add `!` after the type:

```
feat(nexus-api)!: change user authentication flow
```

Optionally, add a footer explaining the breaking change:

```
feat(nexus-api)!: change user authentication flow

BREAKING CHANGE: Authentication now requires email verification.
Existing users must verify their email before accessing the platform.
```

---

## Tips for Writing Good Commits

✅ **Do:**
- Commit logical units of work
- Keep commits small and focused
- Write clear, descriptive messages
- Reference issue numbers in the description when relevant

❌ **Don't:**
- Mix multiple unrelated changes in one commit
- Use vague messages like "fix bug" or "update code"
- Include work-in-progress commits in PRs (squash them)

---

## Related Guidelines

- **[702 - Submitting a Pull Request](./702-SubmittingAPullRequest.md)** – PR title follows same format
- **[703 - Naming Your Branches](./703-NamingYourBranches.md)** – Branch types match commit types
- **[705 - Contributing](./705-Contributing.md)** – Complete workflow

---

**[🏠 Repository](../../README.md)** • **[📚 Onboarding](../Onboarding/README.md)** • **[📖 Coding Guidelines](./README.md)**
