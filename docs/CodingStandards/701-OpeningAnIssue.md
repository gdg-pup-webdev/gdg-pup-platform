when creating an issue, the title could be anything.

the following tags are required

## project tags:

must have atleast one project tag. highlight the projects that is affected by the issue.

- project tags are the names of each project inside the monorepo.

### available project tags

- repository - Global repository changes (Root configs, CI/CD, global docs, or scripts).
- nexus-api - Issues affecting the Nexus backend service.
- identity-api - Issues affecting the Identity/Auth backend service.
- nexus-api-contracts - Changes to shared Nexus API schemas or TypeScript contracts.
- identity-api-contracts - Changes to shared Identity API schemas or TypeScript contracts.
- nexus-web - Issues affecting the Nexus frontend/web application.
- typed-rest - Changes to the internal typed-rest utility.

## severity:

must have exactly one severity tag

- low - Non-critical issues, minor UI tweaks, or "nice-to-have" improvements.
- normal - Standard tasks or bugs that don't block work but need resolution
- high - Significant impact on functionality or blocking a specific feature.
- severe - Critical system failure, security leak, or production-down situation.

## type:

must have exactly one type

- refactor - Code changes that improve structure without changing behavior.
- release - Tasks related to deploying to production.
- hotfix - Critical patches specifically for the main branch/production.
- bug - issues found in the dev branch or during staging.
- feature - New functionality or capabilities added for the user.
- enhance - Improvements to existing features (performance, UX, or minor logic updates).
- documentation - Updates to READMEs, API docs, or internal guides.

# description

for the description, you must provide the following:

context: briefly explain what the issue is about. if this is a bug, this is where you explain what you are trying to do and what is happening. if refactor, feature, explain what the feature is for. if this is a enhance or refactor, explain the reason for the change.
steps to reproduce (if applicable): step by step guide on how to reproduce the problem
goals: explain what the final result looks like. e.g. for features, list down the final features that needs to be implemented.
