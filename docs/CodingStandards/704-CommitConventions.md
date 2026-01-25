Our commit convention strictly follows the conventional commit standard 
read more about it using this link: https://www.conventionalcommits.org/en/v1.0.0/


Each commit message should follow this structure: <type>(<project>): <description>

the type must describe what you did generally to the codebase on that commit.
below are some of the commit types that you must use:

- feat - A new feature for the user.
- fix - A bug fix (matches bug/ or hotfix/ branches).
- enhance - An improvement to existing code.
- refactor - Code change that neither fixes a bug nor adds a feature.
- docs - Documentation changes only.
- chore - Maintenance tasks (dependency updates, config changes).
- release - Commits used to bump versions.

the project is the name of the project that is mostly affected by the commit

description contains a summary of the change

if you pulled changes from remote or on another branch, you can simply do the following in the commit message:

- merge: <branch-name>