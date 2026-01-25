**[🏠 Repository](../../README.md)** • **[📚 Onboarding](../Onboarding/README.md)** • **[📖 Coding Guidelines](./README.md)**

---

# 703 - Naming Your Branches

## Overview

Consistent branch naming makes it easy to identify what work is being done and helps organize our Git workflow.

## General Guidelines

- **Keep branch names short and simple**
- **Use only lowercase letters**
- **The branch type generally matches the issue type**

---

## Protected Branches

These branches have special meaning and **must not** have sub-branches:

| Branch | Purpose | Sub-branches? |
|--------|---------|---------------|
| `main` | Production code | ❌ No `main/something` |
| `dev` | Development code | ❌ No `dev/something` |

---

## Branch Types

### Release Branches

**Pattern:** `release/<version>`

Used for preparing a new production release.

**Examples:**
```
release/v1.0.0
release/v2.1.3
```

---

### Hotfix Branches

**Pattern:** `hotfix/<issue-name>-#<issue-number>`

For fixing critical issues in the `main` branch (production).

**Format:**
- Start with `hotfix/`
- Followed by kebab-case issue name
- End with `-#` and the issue number

**Examples:**
```
hotfix/critical-auth-bug-#100
hotfix/payment-failure-#245
```

---

### Feature Branches

**Pattern:** `feat/<feature-name>-#<issue-number>`

For developing new features.

**Format:**
- Start with `feat/`
- Followed by kebab-case feature name
- End with `-#` and the issue number

**Examples:**
```
feat/event-registration-#102
feat/user-profile-page-#156
```

---

### Enhancement Branches

**Pattern:** `enhance/<feature-name>-#<issue-number>`

For improving existing features.

**Format:**
- Start with `enhance/`
- Followed by kebab-case feature name
- End with `-#` and the issue number

**Examples:**
```
enhance/search-performance-#87
enhance/user-dashboard-#134
```

---

### Bug Fix Branches

**Pattern:** `bug/<bug-name>-#<issue-number>`

For fixing issues in the `dev` branch (staging/development).

**Format:**
- Start with `bug/`
- Followed by kebab-case bug description
- End with `-#` and the issue number

**Examples:**
```
bug/button-not-working-#65
bug/registration-validation-#98
```

---

### Refactor Branches

**Pattern:** `refactor/<what-you're-refactoring>-#<issue-number>`

For code refactoring without changing functionality.

**Format:**
- Start with `refactor/`
- Followed by kebab-case description
- End with `-#` and the issue number

**Examples:**
```
refactor/user-service-#120
refactor/event-repository-#145
```

---

### Documentation Branches

**Pattern:** `docs/<what-you're-documenting>-#<issue-number>`

For documentation updates.

**Format:**
- Start with `docs/`
- Followed by  kebab-case description
- End with `-#` and the issue number

**Examples:**
```
docs/api-documentation-#101
docs/setup-guide-#89
docs/coding-guidelines-#234
```

---

## Branch Naming Quick Reference

| Type | Pattern | Example |
|------|---------|---------|
| **Release** | `release/<version>` | `release/v1.0.0` |
| **Hotfix** | `hotfix/<name>-#<num>` | `hotfix/auth-bug-#100` |
| **Feature** | `feat/<name>-#<num>` | `feat/registration-#102` |
| **Enhancement** | `enhance/<name>-#<num>` | `enhance/search-#87` |
| **Bug Fix** | `bug/<name>-#<num>` | `bug/validation-#65` |
| **Refactor** | `refactor/<name>-#<num>` | `refactor/user-service-#120` |
| **Documentation** | `docs/<name>-#<num>` | `docs/api-docs-#101` |

---

## Naming Conventions Summary

✅ **Always:**
- Use lowercase
- Use kebab-case for names
- Include issue number with `#`
- Keep names short but descriptive

❌ **Never:**
- Use spaces or underscores
- Use capital letters
- Create sub-branches of `main` or `dev`
- Omit the issue number

---

## Related Guidelines

- **[701 - Opening an Issue](./701-OpeningAnIssue.md)** – Issue types that determine branch types
- **[704 - Commit Conventions](./704-CommitConventions.md)** – Commit message format
- **[705 - Contributing](./705-Contributing.md)** – Complete workflow

---

**[🏠 Repository](../../README.md)** • **[📚 Onboarding](../Onboarding/README.md)** • **[📖 Coding Guidelines](./README.md)**
