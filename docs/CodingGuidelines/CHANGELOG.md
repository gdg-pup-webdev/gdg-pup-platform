# Coding Guidelines Changelog

All notable changes to the coding guidelines will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## How to Update This Changelog

When making changes to coding guidelines, update this changelog following these steps:

1. **Add a new entry** at the top of the changelog (after this section)
2. **Use the current date** in YYYY-MM-DD format
3. **Include your username** in the Author field
4. **Categorize changes** using Added/Changed/Fixed/Removed sections
5. **Provide rationale** explaining why the changes were made
6. **Link to modified files** using relative markdown links

### Template for New Entries

```markdown
## [YYYY-MM-DD] - Brief Description

**Author:** @your-username

### Added
- New guideline files or sections

### Changed
- Modified guidelines or clarifications

### Fixed
- Corrected typos, broken links, or inaccuracies

### Removed
- Deprecated or obsolete guidelines

**Rationale:** Brief explanation of why these changes were made
```

**Example Entry:**
```markdown
## [2026-01-26] - Added Testing Guidelines

**Author:** @developer-name

### Added
- New guideline **[106-Testing.md](./106-Testing.md)** covering unit and integration testing standards

**Rationale:** Team needed clear guidance on testing expectations and patterns
```

---

## [2026-01-25] - Initial Creation of Coding Guidelines

**Author:** Erwin Daguinotas

### Added
- **[README.md](./README.md)** - Root documentation with complete navigation system
- **[101-ApiUtilities.md](./101-ApiUtilities.md)** - Guidelines for creating reusable utility functions
- **[102-LayeredArchitecture.md](./102-LayeredArchitecture.md)** - Backend layered architecture standards
- **[103-ContractFirstDevelopment.md](./103-ContractFirstDevelopment.md)** - Contract-first API development approach
- **[104-ShallowRoutesDesign.md](./104-ShallowRoutesDesign.md)** - API endpoint routing conventions
- **[105-ErrorHandling.md](./105-ErrorHandling.md)** - Error handling patterns across layers
- **[401-FileStructure.md](./401-FileStructure.md)** - Folder-by-feature organization standards
- **[501-TheGreyArea.md](./501-TheGreyArea.md)** - When and how to deviate from guidelines
- **[502-RefactoringAndDeprecation.md](./502-RefactoringAndDeprecation.md)** - Safe refactoring practices
- **[503-CodeReadability.md](./503-CodeReadability.md)** - Self-documenting code principles
- **[504-DocumentingYourCode.md](./504-DocumentingYourCode.md)** - Documentation guidelines
- **[505-CodeStructure.md](./505-CodeStructure.md)** - Code organization within files
- **[601-UpdatingTheCodingStandards.md](./601-UpdatingTheCodingStandards.md)** - Process for updating guidelines
- **[701-OpeningAnIssue.md](./701-OpeningAnIssue.md)** - Issue creation standards
- **[702-SubmittingAPullRequest.md](./702-SubmittingAPullRequest.md)** - Pull request guidelines
- **[703-NamingYourBranches.md](./703-NamingYourBranches.md)** - Branch naming conventions
- **[704-CommitConventions.md](./704-CommitConventions.md)** - Commit message standards
- **[705-Contributing.md](./705-Contributing.md)** - Complete contribution workflow
- **[CHANGELOG.md](./CHANGELOG.md)** - This changelog file

### Changed
- None (initial creation)

### Fixed
- None (initial creation)

### Removed
- None (initial creation)

**Rationale:** Established comprehensive coding guidelines to maintain code quality, scalability, and consistency across the GDG PUP Platform monorepo. These guidelines provide clear standards for backend development, project structure, general coding practices, documentation, and collaboration workflows.

