**[🏠 Repository](../../README.md)** • **[📚 Onboarding](../Onboarding/README.md)**

---

# Coding Guidelines

Welcome to the **GDG PUP Platform Coding Guidelines** – a comprehensive set of standards and best practices designed to maintain code quality, scalability, and consistency across our monorepo. These guidelines empower our team to build maintainable, type-safe applications while fostering effective collaboration.

## 📋 Purpose & Philosophy

Our coding guidelines are built on the following core principles:

- **🎯 Scalability**: Design decisions that support growth and maintainability
- **🔒 Type Safety**: End-to-end type safety through contract-first development
- **🏗️ Architectural Integrity**: Clear separation of concerns with layered architecture
- **🤝 Collaboration**: Consistent workflows for seamless team coordination
- **📖 Self-Documenting Code**: Readable code that explains itself

These guidelines reflect lessons learned and best practices developed specifically for our platform's unique needs.

---

## 🗂️ Organization & Numbering System

Guidelines are organized using a systematic numbering convention: `XYZ`

- **X** = Major category (see below)
- **Y** = Always `0` (separator)
- **Z** = Minor number within category

### Categories

| Category              | Number Range | Description                                               |
| --------------------- | ------------ | --------------------------------------------------------- |
| **Backend**           | 100-199      | Backend API development standards                         |
| **Frontend**          | 200-299      | Frontend development patterns _(reserved for future use)_ |
| **Contracts**         | 300-399      | API contract specifications _(reserved for future use)_   |
| **Project Structure** | 400-499      | File organization and architecture                        |
| **General Standards** | 500-599      | Universal coding practices                                |
| **Documentation**     | 600-699      | Documentation standards                                   |
| **Collaboration**     | 700-799      | Git workflow, PRs, and teamwork                           |

---

## 📚 Guidelines by Category

### 🔧 Backend Development (100s)

Core principles for building our Express.js backend APIs.

- **[101 - API Utilities](./101-ApiUtilities.md)** – Guidelines for creating reusable utility functions
- **[102 - Layered Architecture](./102-LayeredArchitecture.md)** – Separation between controllers, services, and repositories
- **[103 - Contract-First Development](./103-ContractFirstDevelopment.md)** – Building type-safe APIs with contracts
- **[104 - Shallow Routes Design](./104-ShallowRoutesDesign.md)** – API endpoint structure and naming conventions
- **[105 - Error Handling](./105-ErrorHandling.md)** – Graceful error management patterns

---

### 📁 Project Structure (400s)

How we organize files and folders throughout the monorepo.

- **[401 - File Structure](./401-FileStructure.md)** – Flat, feature-based organization principles

---

### ✨ General Coding Standards (500s)

Universal best practices that apply across all codebases.

- **[501 - The Grey Area](./501-TheGreyArea.md)** – When and how to deviate from guidelines
- **[502 - Refactoring & Deprecation](./502-RefactoringAndDeprecation.md)** – Safely evolving the codebase
- **[503 - Code Readability](./503-CodeReadability.md)** – Writing self-documenting code
- **[504 - Documenting Your Code](./504-DocumentingYourCode.md)** – When and how to add comments
- **[505 - Code Structure](./505-CodeStructure.md)** – Organizing logic within files

---

### 📝 Documentation Standards (600s)

Maintaining and contributing to these guidelines.

- **[601 - Updating the Coding Guidelines](./601-UpdatingTheCodingStandards.md)** – How to propose changes to guidelines

---

### 🤝 Collaboration & Workflow (700s)

Git workflows, issue tracking, and pull request conventions.

- **[701 - Opening an Issue](./701-OpeningAnIssue.md)** – Issue templates, tags, and descriptions
- **[702 - Submitting a Pull Request](./702-SubmittingAPullRequest.md)** – PR standards and checklist
- **[703 - Naming Your Branches](./703-NamingYourBranches.md)** – Branch naming conventions
- **[704 - Commit Conventions](./704-CommitConventions.md)** – Conventional commit standards
- **[705 - Contributing](./705-Contributing.md)** – Complete contribution workflow
- **[706 - Agile & Kanban Board](./706-AgileKanbanBoard.md)** – Agile & Kanban board standards

---

## 🚀 Quick Reference

### For New Features

1. Review **[103 - Contract-First Development](./103-ContractFirstDevelopment.md)**
2. Follow **[102 - Layered Architecture](./102-LayeredArchitecture.md)**
3. Check **[701 - Opening an Issue](./701-OpeningAnIssue.md)** and **[703 - Naming Your Branches](./703-NamingYourBranches.md)**

### For Code Quality

1. **[503 - Code Readability](./503-CodeReadability.md)** – Keep code self-documenting
2. **[504 - Documenting Your Code](./504-DocumentingYourCode.md)** – When comments are needed
3. **[105 - Error Handling](./105-ErrorHandling.md)** – Proper error patterns

### For Collaboration

1. **[703 - Naming Your Branches](./703-NamingYourBranches.md)** – Branch naming
2. **[704 - Commit Conventions](./704-CommitConventions.md)** – Commit messages
3. **[702 - Submitting a Pull Request](./702-SubmittingAPullRequest.md)** – PR workflow

---

## 💡 Understanding the Rationale

Each guideline exists to solve specific challenges we've encountered:

- **Contract-First Development** ensures frontend and backend can evolve independently without breaking changes
- **Layered Architecture** decouples database schema from API contracts, allowing flexible refactoring
- **Shallow Routes** keep API endpoints intuitive and maintainable
- **Folder-by-Feature** makes related code easy to find and modify together

When you understand the "why" behind each guideline, you can make better decisions about when to follow them strictly and when to thoughtfully deviate (see **[501 - The Grey Area](./501-TheGreyArea.md)**).

---

## 🔄 Contributing to Guidelines

These guidelines are living documents. If you identify:

- ❌ Conflicting guidance between guidelines
- 📝 Missing scenarios not covered
- 💡 Better approaches based on experience

Please see **[601 - Updating the Coding Guidelines](./601-UpdatingTheCodingStandards.md)** for how to propose changes.

**Important:** All guideline updates must be documented in **[CHANGELOG.md](./CHANGELOG.md)** with author attribution and rationale.

---

## 🎓 Related Documentation

- **[Developer Onboarding](../Onboarding/README.md)** – Learn the platform architecture and development workflow
- **[Architecture Guide](../ARCHITECTURE.md)** – Deep dive into system design
- **[Database Guide](../DATABASE.md)** – Schema and migration patterns

---

**[🏠 Repository](../../README.md)** • **[📚 Onboarding](../Onboarding/README.md)**
