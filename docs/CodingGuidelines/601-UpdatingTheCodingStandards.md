**[🏠 Repository](../../README.md)** • **[📚 Onboarding](../Onboarding/README.md)** • **[📖 Coding Guidelines](./README.md)**

---

# 601 - Updating the Coding Guidelines

## Overview

These coding guidelines are living documents that evolve with our platform. This guide explains how to propose and implement changes.

## File Naming Convention

Guidelines follow a systematic numbering pattern: **`XY Z`**

- **`X`** = Major category
- **`Y`** = Always `0` (separator)
- **`Z`** = Minor number within the category

### Example

**`105`** breaks down as:
- `1` = Backend category
- `0` = Separator
- `5` = Fifth guideline in the backend category

## Major Categories

| Major Value | Category | Description |
|-------------|----------|-------------|
| **1** | Backend | Express.js API development standards |
| **2** | Frontend | Client-side development patterns _(reserved)_ |
| **3** | Contracts | API contract specifications _(reserved)_ |
| **4** | Project Structure | File and folder organization |
| **5** | General Standards | Universal coding practices |
| **6** | Documentation | Documentation and guideline management |
| **7** | Collaboration | Git workflow, PRs, and teamwork |

## How to Propose a New Guideline

### 1. Open an Issue

Before creating a new guideline, **open an issue** to discuss:

- **Why** the guideline is needed
- **What** problem it solves
- **How** it will improve the codebase
- **Which** category it belongs to

**Issue Template:**
```markdown
**Title:** [Guideline Proposal] <Brief Description>

**Category:** <100s/200s/300s/etc.>

**Problem:**
Describe the issue or gap in current guidelines

**Proposed Guideline:**
Outline the key points of the proposed guideline

**Benefits:**
- How this helps the codebase
- What problems it prevents

**Examples:**
Provide examples of good vs bad practices
```

### 2. Determine the Guideline Number

Find the next available number in the appropriate  category:

```
Backend (100s):
  101 ✓ (API Utilities)
  102 ✓ (Layered Architecture)
  103 ✓ (Contract-First Development)
  104 ✓ (Shallow Routes Design)
  105 ✓ (Error Handling)
  106 ← Next available
```

### 3. Submit a Pull Request

Create a new guideline file following the established format:

**File Structure:**
```markdown
**[🏠 Repository](../../README.md)** • **[📚 Onboarding](../Onboarding/README.md)** • **[📖 Coding Guidelines](./README.md)**

---

# <Number> - <Title>

## Overview
Brief description of the guideline

## Core Principle
Main idea in 1-2 sentences

## Guidelines
Specific rules and recommendations

## Examples
✅ Good examples
❌ Bad examples

## Rationale
Why this guideline exists

---

## Related Guidelines
- Links to related guidelines

---

**[🏠 Repository](../../README.md)** • **[📚 Onboarding](../Onboarding/README.md)** • **[📖 Coding Guidelines](./README.md)**
```

### 4. Update the Root README

Add your new guideline to [`README.md`](./README.md) in the appropriate category section.

### 5. Update the Changelog

Add an entry to [`CHANGELOG.md`](./CHANGELOG.md) documenting your changes:

```markdown
## [YYYY-MM-DD] - Brief Description

**Author:** @your-username

### Added
- New guideline **[10X-YourGuideline.md](./10X-YourGuideline.md)** - Brief description

**Rationale:** Explain why this guideline was needed
```

See the [changelog template](./CHANGELOG.md#template-for-new-entries) for the complete format.

## Updating Existing Guidelines

If you find:
- ❌ **Conflicting guidance** between guidelines
- 📝 **Missing scenarios** not covered
- 💡 **Better approaches** based on experience

### Process

1. **Open an issue** describing the conflict or gap
2. **Propose changes** with clear rationale
3. **Submit a pull request** with:
   - Updated guideline content
   - Examples showing the improvement
   - Explanation in PR description
   - **Updated [CHANGELOG.md](./CHANGELOG.md)** entry documenting the changes

**Changelog Entry Example:**
```markdown
## [2026-01-26] - Clarified Error Handling Guidelines

**Author:** @your-username

### Changed
- **[105-ErrorHandling.md](./105-ErrorHandling.md)** - Clarified tryCatch usage patterns

**Rationale:** Developers were confused about when to use tryCatch vs try-catch
```

## When to Create vs Update

| Situation | Action |
|-----------|--------|
| Entirely new topic not covered | **Create new guideline** |
| Clarifying existing guideline | **Update existing guideline** |
| Conflicting rules | **Update both guidelines** to align |
| Adding examples to existing rule | **Update existing guideline** |
| Deprecating old practice | **Update + add deprecation notice** |

## Review Process

1. **Community Discussion**: Issue discussion period
2. **Team Review**: Lead developers review the proposal
3. **PR Approval**: Requires approval from team leads
4. **Merge**: Once approved, guideline becomes official

## Version Control

Guidelines are version-controlled through Git:
- **History**: View all changes to a guideline via Git history
- **Blame**: See who introduced specific sections
- **Revert**: Roll back problematic changes if needed

---

## Related Guidelines

- **[501 - The Grey Area](./501-TheGreyArea.md)** – When to deviate from guidelines
- **[702 - Submitting a Pull Request](./702-SubmittingAPullRequest.md)** – PR standards
- **[701 - Opening an Issue](./701-OpeningAnIssue.md)** – Issue creation guidelines

---

**[🏠 Repository](../../README.md)** • **[📚 Onboarding](../Onboarding/README.md)** • **[📖 Coding Guidelines](./README.md)**
