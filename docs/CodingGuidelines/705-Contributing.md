**[🏠 Repository](../../README.md)** • **[📚 Onboarding](../Onboarding/README.md)** • **[📖 Coding Guidelines](./README.md)**

---

# 705 - Contributing

## Overview

This guide outlines the complete workflow for contributing to the project, covering three common scenarios.

---

## Scenario 1: You Want to Make a Change (No Existing Issue)

When you want to make a change but there's no related issue:

### Workflow

```
1. Open Issue → 2. Create Branch → 3. Make Changes → 4. Commit → 5. Push → 6. Open PR
```

### Detailed Steps

#### 1. Open a New Issue

Create an issue following the **[701 - Opening an Issue](./701-OpeningAnIssue.md)** guidelines.

- Add appropriate tags (project, severity, type)
- Provide context, steps to reproduce (if applicable), and goals
- Wait for the issue to be reviewed and approved

#### 2. Create a New Branch

Follow the **[703 - Naming Your Branches](./703-NamingYourBranches.md)** convention:

```bash
# Example: Creating a feature branch for issue #102
git checkout dev
git pull origin dev
git checkout -b feat/event-registration-#102
```

#### 3. Make Your Changes

- Write code following our **[Coding Guidelines](./README.md)**
- Keep commits small and logical
- Test your changes locally

#### 4. Commit Your Changes

Follow **[704 - Commit Conventions](./704-CommitConventions.md)**:

```bash
git add .
git commit -m "feat(nexus-api): implement event registration validation"
```

#### 5. Push Your Changes

```bash
git push origin feat/event-registration-#102
```

#### 6. Open a Pull Request

Follow **[702 - Submitting a Pull Request](./702-SubmittingAPullRequest.md)**:

- Link to the related issue (`Closes #102`)
- Provide clear summary and strategies
- Ensure tests pass and build succeeds

---

## Scenario 2: You See an Open Issue (No Assigned Developer)

When there's an existing issue that needs work:

### Workflow

```
1. Assign Yourself → 2. Create Branch → 3. Make Changes → 4. Commit → 5. Push → 6. Open PR
```

### Detailed Steps

#### 1. Assign Yourself to the Issue

- Go to the issue on GitHub
- Click "Assignees" and add yourself
- Add a comment indicating you're working on it (optional but recommended)

#### 2-6. Follow the Same Steps as Scenario 1

Create a branch, make changes, commit, push, and open a PR as described above.

---

## Scenario 3: You Are Assigned to an Issue

When you've been assigned to work on an issue:

### Workflow

```
1. Understand Requirements → 2. Create Branch → 3. Make Changes → 4. Commit → 5. Push → 6. Open PR
```

### Detailed Steps

#### 1. Understand the Requirements

- Read the issue description thoroughly
- Review the context, goals, and acceptance criteria
- Ask questions in the issue comments if anything is unclear
- Discuss the approach with your team lead if needed

#### 2-6. Follow the Same Steps as Scenario 1

Create a branch, make changes, commit, push, and open a PR.

---

## Quick Reference: Collaboration Guidelines

For all scenarios above, you **must** adhere to our collaboration guidelines:

| Guideline                                                              | Purpose                          |
| ---------------------------------------------------------------------- | -------------------------------- |
| **[701 - Opening an Issue](./701-OpeningAnIssue.md)**                  | How to create well-formed issues |
| **[702 - Submitting a Pull Request](./702-SubmittingAPullRequest.md)** | PR standards and checklist       |
| **[703 - Naming Your Branches](./703-NamingYourBranches.md)**          | Branch naming conventions        |
| **[704 - Commit Conventions](./704-CommitConventions.md)**             | Commit message format            |

---

## Complete Contribution Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    CONTRIBUTION WORKFLOW                     │
└─────────────────────────────────────────────────────────────┘

  ┌──────────────┐
  │ Find/Create  │
  │    Issue     │
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │   Assign to  │
  │   Yourself   │
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐       Follow guideline 703
  │Create Branch │ ◄──── (feat/issue-name-#123)
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │Make Changes  │       Follow coding guidelines
  │              │ ◄──── (Guidelines 101-505)
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐       Follow guideline 704
  │    Commit    │ ◄──── (feat(nexus-api): add feature)
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │     Push     │
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐       Follow guideline 702
  │   Open PR    │ ◄──── (Link issue, add context)
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │Code Review   │
  │& Approval    │
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │    Merge     │
  │  to `dev`    │
  └──────────────┘
```

---

## Common Questions

### Q: Can I work on multiple issues simultaneously?

**A:** Yes, but create separate branches for each issue. Keep work isolated to avoid conflicts.

```bash
git checkout dev
git checkout -b feat/feature-a-#101

# Later, for a different issue
git checkout dev
git checkout -b bug/fix-b-#102
```

### Q: What if I need to update my branch with latest `dev` changes?

**A:** Rebase your branch onto `dev`:

```bash
git checkout dev
git pull origin dev
git checkout your-branch
git rebase dev
```

### Q: How do I handle merge conflicts?

**A:** Resolve conflicts locally, then continue:

```bash
# After rebase conflict
# 1. Fix conflicts in your editor
# 2. Stage the resolved files
git add .
# 3. Continue the rebase
git rebase --continue
```

---

## Related Guidelines

- **[Coding Guidelines Root](./README.md)** – All coding standards
- **[Onboarding Guide](../Onboarding/README.md)** – Learning the platform
- **[Development Workflow](../Onboarding/7-DevelopmentWorkflow.md)** – Daily development practices

---

**[🏠 Repository](../../README.md)** • **[📚 Onboarding](../Onboarding/README.md)** • **[📖 Coding Guidelines](./README.md)**
