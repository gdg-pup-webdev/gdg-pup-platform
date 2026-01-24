# Git and GitHub Guide for Contributors

A step-by-step guide for contributing to **GDG PUP Platform** projects using Git and GitHub. Follow this workflow for all your contributions.

---

## Prerequisites

Before you start, make sure you have:

- Git installed on your machine (see [Setting Up The Project](./0-SettingUpTheProject.md))
- A GitHub account
- Access to the GDG PUP GitHub organization
- The repository URL you want to contribute to

---

## Git Workflow Overview

Here's the typical workflow you'll follow for every contribution:

1. Fork the repository (if you don't have write access)
2. Clone the repository to your local machine
3. Create a new branch for your work (from `dev`)
4. Make your changes
5. Stage and commit your changes
6. Push your changes to GitHub
7. Create a pull request
8. Wait for review and merge

Let's break down each step.

---

## Step 1: Fork the Repository

**Purpose:** Create a personal copy of the repository in your GitHub account.

**Action:**
1. Go to the repository page on GitHub.
2. Click the **Fork** button in the top-right corner.
3. GitHub will create a copy of the repository under your account.

**Note:** If you already have write access to the repository (e.g., Core Team), you can skip this step and clone directly.

---

## Step 2: Clone the Repository

**Purpose:** Download a local copy of the repository to your computer.

**Command:**
```bash
git clone <repository-url>
```

**Example:**
```bash
git clone https://github.com/gdg-pup-webdev/gdgnexussecondclone.git
```

**Tip:** You can find the repository URL by clicking the green **Code** button on GitHub.

---

## Step 3: Navigate to the Repository Folder

**Purpose:** Move into the repository folder so you can run Git commands.

**Command:**
```bash
cd <repository-folder-name>
```

**Example:**
```bash
cd gdgnexussecondclone
```

---

## Step 4: Set Remote URL (if needed)

**Purpose:** Link your local repository with your remote GitHub repository.

**Command:**
```bash
git remote add origin <url>
```

**Check your remotes:**
```bash
git remote -v
```

You should see something like:
```
origin  https://github.com/your-username/repository-name.git (fetch)
origin  https://github.com/your-username/repository-name.git (push)
```

**Note:** If you cloned the repository, the remote is already set. You only need this step if you initialized a local repository manually.

---

## Branching & Git Workflow

### Branch Naming Convention

| Branch Type     | Naming Convention      | Example                   |
| --------------- | ---------------------- | ------------------------- |
| **Main**        | `main`                 | `main`                    |
| **Development** | `dev`                  | `dev`                     |
| **Feature**     | `feature/feature-name` | `feature/add-auth`        |
| **Bugfix**      | `bugfix/issue-name`    | `bugfix/fix-footer`       |
| **Hotfix**      | `hotfix/critical-fix`  | `hotfix/fix-login-crash`  |

### 1. Switch to develop branch

**Purpose:** Always start from the latest development branch (`dev`).

```bash
git checkout dev
git pull origin dev
```

### 2. Create a feature branch

**Purpose:** Keep your work separate from the main/dev branch. This makes it easier to manage multiple features or fixes.

```bash
git checkout -b feature/feature-name
```

**Examples:**
```bash
git checkout -b feature/add-login-auth
git checkout -b bugfix/fix-footer-alignment
git checkout -b hotfix/fix-critical-login-bug
```

### 3. Make your changes in the code

**Action:** Add or modify files as needed for your contribution. Use your code editor to make the changes. Save your files when you're done.

### 4. Check Status

**Purpose:** See which files have been modified or staged.

**Command:**
```bash
git status
```

This will show you:
- Files you've modified (red)
- Files you've staged for commit (green)

### 5. Stage Changes

**Purpose:** Prepare files for commit.

**Stage all changes:**
```bash
git add .
```

**Stage a specific file:**
```bash
git add <file-name>
```

---

## Commit Message Guidelines

### Commit Message Format

```
<type>(<scope>): <description>
```

### Allowed Commit Types

This project follows [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).

| Type         | Description                                           |
| ------------ | ----------------------------------------------------- |
| **feat**     | A new feature                                         |
| **fix**      | A bug fix                                             |
| **docs**     | Documentation changes                                 |
| **style**    | Code style changes (formatting, etc.)                 |
| **refactor** | Code changes that neither fix a bug nor add a feature |
| **perf**     | Performance improvements                              |
| **test**     | Adding or modifying tests                             |
| **chore**    | Maintenance and other minor tasks                     |

### 6. Commit your changes

**Command:**
```bash
git commit -m "<type>(<scope>): <description>"
```

**Examples:**
```bash
git commit -m "feat(auth): add login authentication"
git commit -m "fix(navbar): resolve mobile responsiveness issue"
git commit -m "docs(readme): update contribution guide"
git commit -m "style(button): improve button styling consistency"
git commit -m "refactor(api): simplify authentication logic"
```

**Good commit message practices:**
- Use present tense ("Add feature" not "Added feature")
- Be clear and concise
- Use the conventional commit format

---

## Step 7: Pull Latest Changes (Important!)

**Purpose:** Make sure your branch is up to date with the `dev` branch before pushing.

```bash
git pull origin dev
```

**Tip:** Always do this before pushing to avoid merge conflicts later.

---

## Step 8: Push Changes

**Purpose:** Send your local commits to your remote repository on GitHub.

```bash
git push origin feature/feature-name
```

**Example:**
```bash
git push origin feature/add-login-auth
```

If this is your first push on this branch, Git might ask you to set the upstream:
```bash
git push --set-upstream origin feature/feature-name
```

---

## Pull Request Guidelines

### Step 9: Create a Pull Request (PR)

**Purpose:** Submit your changes for review before merging into the `dev` branch.

**Action:**
1. Go to your repository on GitHub.
2. You'll see a banner that says **"Compare & pull request"** — click it.
3. If you don't see it, go to the **Pull Requests** tab and click **New Pull Request**.
4. Select your branch and merge into `dev` (not `main`).
5. Use the PR template below for your description.
6. Click **Create Pull Request**.

### PR Title Format

```
<type>(<scope>): <short description>
```

**Examples:**
```
feat(auth): add user login functionality
fix(navbar): resolve mobile responsiveness issue
docs(readme): update setup instructions
```

### PR Description Template

```markdown
What's New?
Briefly explain what was added or changed

Screenshots
Add relevant screenshots or gifs if applicable

Related Issues
Closes #ISSUE_NUMBER (if applicable)

Checklist
- [ ] Code follows project conventions
- [ ] Linted and formatted
- [ ] Tested locally
```

---

## Step 10: Review and Merge Pull Request

**Purpose:** Integrate changes into the `dev` branch after review.

**For contributors:**
- Wait for a team lead or maintainer to review your PR.
- Address any requested changes.
- Once approved, a maintainer will merge your PR.

**For maintainers:**
- Review the code changes.
- Leave comments or request changes if needed.
- Once approved, click **Squash and Merge** to combine all commits into a single commit for cleaner history.
- Delete the branch after merging (GitHub will prompt you).

---

## Working on a New Feature

Ready to start a new feature? Here's a quick workflow:

```bash
# Make sure you're on the dev branch
git checkout dev

# Pull the latest changes
git pull origin dev

# Create a new branch for your feature
git checkout -b feature/feature-name

# Make your changes, then stage and commit
git add .
git commit -m "feat(scope): description"

# Push to GitHub
git push origin feature/feature-name

# Create a pull request on GitHub
```

---

## Common Git Commands

Here's a quick reference for commands you'll use often:

| Command | Purpose |
|---------|---------|
| `git status` | Check the status of your files |
| `git add <file>` | Stage a specific file |
| `git add .` | Stage all changes |
| `git commit -m "message"` | Commit staged changes |
| `git push origin <branch>` | Push changes to GitHub |
| `git pull origin dev` | Pull latest changes from dev |
| `git checkout -b <branch>` | Create and switch to a new branch |
| `git checkout <branch>` | Switch to an existing branch |
| `git branch` | List all branches |
| `git log` | View commit history |
| `git diff` | See changes before staging |

---

## Tips and Best Practices

**Always pull before you push:**
```bash
git pull origin dev
```
This keeps your branch up to date and prevents merge conflicts.

**Use meaningful commit messages:**
- Good: `feat(auth): add user authentication endpoint`
- Bad: `updates`
- Bad: `fix stuff`

**Commit often, push regularly:**
Don't wait until you've written 1000 lines of code to commit. Small, frequent commits make it easier to track changes and debug issues.

**One feature per branch:**
Keep your branches focused on a single feature or fix. This makes pull requests easier to review.

**Test before you push:**
Make sure your code works locally before pushing to GitHub. Run tests, check for errors, and verify functionality.

**Practice in a test repository:**
If you're new to Git, create a test repository and practice these steps before contributing to the main project.

---

## Troubleshooting

**"Permission denied" when pushing:**
- Make sure you've accepted the GitHub organization invitation.
- Check that you have write access to the repository.
- Verify you're pushing to your fork, not the original repository.

**Merge conflicts:**
- Pull the latest changes from dev: `git pull origin dev`
- Resolve conflicts in your editor.
- Stage the resolved files: `git add .`
- Commit the merge: `git commit -m "chore: resolve merge conflicts"`
- Push: `git push origin <branch-name>`

**Accidentally committed to main:**
- Create a new branch from your current state: `git checkout -b feature/feature-name`
- Reset main to match the remote: `git checkout main && git reset --hard origin/main`
- Switch back to your feature branch: `git checkout feature/feature-name`

**Need to undo the last commit:**
```bash
git reset --soft HEAD~1
```
This keeps your changes but removes the commit.

**Need help?**
Post in the **DevTeam** channel or contact a Team Lead.

---

## Additional Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
- [Interactive Git Tutorial](https://learngitbranching.js.org/)

---

**Now you're ready to contribute. Let's build something great together.**
