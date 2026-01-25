**[🏠 Repository](../../README.md)** • **[📚 Onboarding](../Onboarding/README.md)** • **[📖 Coding Guidelines](./README.md)**

---

# 701 - Opening an Issue

## Overview

Proper issue creation helps the team track work efficiently and ensures all necessary context is captured. This guideline explains our issue tagging and description standards.

## Required Tags

Every issue **must** have the following tags:

1. **At least one Project Tag**
2. **Exactly one Severity Tag**
3. **Exactly one Type Tag**

---

## Project Tags

**Required**: Must have **at least one** project tag to indicate which part(s) of the monorepo are affected.

| Tag | Description |
|-----|-------------|
| `repository` | Global repository changes (root configs, CI/CD, global docs, or scripts) |
| `nexus-api` | Issues affecting the Nexus backend service |
| `identity-api` | Issues affecting the Identity/Auth backend service |
| `nexus-api-contracts` | Changes to shared Nexus API schemas or TypeScript contracts |
| `identity-api-contracts` | Changes to shared Identity API schemas or TypeScript contracts |
| `nexus-web` | Issues affecting the Nexus frontend/web application |
| `typed-rest` | Changes to the internal typed-rest utility package |

**Example**: An issue affecting both the API and frontend would use both `nexus-api` and `nexus-web` tags.

---

## Severity Tags

**Required**: Must have **exactly one** severity tag.

| Tag | When to Use | Example |
|-----|-------------|---------|
| `low` | Non-critical issues, minor UI tweaks, or "nice-to-have" improvements | Button color adjustment, tooltip text update |
| `normal` | Standard tasks or bugs that don't block work but need resolution | Missing validation message, slow API response |
| `high` | Significant impact on functionality or blocking a specific feature | Login broken for certain users, registration fails |
| `severe` | Critical system failure, security leak, or production-down situation | Database connection lost, authentication bypass, data leak |

---

## Type Tags

**Required**: Must have **exactly one** type tag.

| Tag | Description | Use When |
|-----|-------------|----------|
| `feature` | New functionality or capabilities added for the user | Adding event registration, user profiles, notifications |
| `enhance` | Improvements to existing features (performance, UX, or minor logic updates) | Making search faster, improving form validation |
| `bug` | Issues found in the dev branch or during staging | Broken functionality, incorrect behavior |
| `hotfix` | Critical patches specifically for the main branch/production | Production is down, security vulnerabilities |
| `refactor` | Code changes that improve structure without changing behavior | Reorganizing files, extracting utilities |
| `documentation` | Updates to READMEs, AP docs, or internal guides | Adding missing docs, clarifying setup steps |
| `release` | Tasks related to deploying to production | Version bumps, changelog updates, deployment prep |

---

## Issue Description Format

The issue description **must** include the following sections:

### 1. Context

Briefly explain what the issue is about.

**For bugs:**
- What were you trying to do?
- What is happening instead?

**For features/enhancements:**
- What feature are you adding/improving?
- Why is it needed?

**For refactors:**
- What code is being refactored?
- Why does it need refactoring?

### 2. Steps to Reproduce (if applicable)

For bugs, provide a **step-by-step guide** to reproduce the problem:

```
1. Navigate to `/events`
2. Click on an event card
3. Click the "Register" button
4. Observe error: "Registration failed"
```

### 3. Goals

Explain what the final result looks like.

**For features:**
- List the specific features that need to be implemented
- Include acceptance criteria

**For bugs:**
- Describe the expected correct behavior

**For refactors:**
- Describe the improved code structure

---

## Issue Title Guidelines

- **Be specific and descriptive**
- **Keep it concise** (50-70 characters)
- **Use action words** where appropriate

### Examples

✅ **Good Titles:**
- `User registration fails with invalid email error`
- `Add event capacity validation to registration flow`
- `Refactor user service to use layered architecture`
- `Update API documentation for authentication endpoints`

❌ **Bad Titles:**
- `Bug in users` (too vague)
- `Fix it` (no context)
- `The registration system is not working properly when users try to sign up for events with special characters in the name` (too long)

---

## Complete Example

**Title:** `Event registration fails when event is at capacity`

**Tags:**
- Project: `nexus-api`, `nexus-web`
- Severity: `high`
- Type: `bug`

**Description:**

### Context
Users are able to register for events even when the event has reached maximum capacity. This violates our business rule that events should close registration when full.

### Steps to Reproduce
1. Create an event with `maxCapacity: 10`
2. Register 10 users for the event
3. Attempt to register an 11th user
4. **Expected**: Registration fails with error message
5. **Actual**: Registration succeeds, event now has 11 registrations

### Goals
- Prevent registration when event is at capacity
- Return clear error message to user: "This event is full"
- Add capacity check in event service before creating registration
- Add frontend validation to disable "Register" button when event is full
- Add test cases for capacity validation

---

## Related Guidelines

- **[702 - Submitting a Pull Request](./702-SubmittingAPullRequest.md)** – Linking issues to PRs
- **[703 - Naming Your Branches](./703-NamingYourBranches.md)** – Branch names reference issue numbers
- **[705 - Contributing](./705-Contributing.md)** – Complete contribution workflow

---

**[🏠 Repository](../../README.md)** • **[📚 Onboarding](../Onboarding/README.md)** • **[📖 Coding Guidelines](./README.md)**
