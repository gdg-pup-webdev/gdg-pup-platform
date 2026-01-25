Pull Request Submission Guide

# Pre-Submission Checklist 
## sync with dev 
update your dev branch and git rebase dev to ensure your code is built on the latest changes.
- git checkout <your-branch>
- git pull origin dev 

## test
Make sure that all tests have been passed 
- on the root of the repository, run: pnpm run test

## build
Run the build command to make sure that everything will build correctly in production 
- pnpm run build

# PR Title Convention
The PR title should be readable and informative. Follow the same convention for commits when making pr titles. 

Format: <Type>(<Project Scope>): <Brief Description> 

Example: feat(nexus-api): implement achievement tier validation 
# body of the pr
for the body of the pr, you can use the following format: 
## Related Issue
Link the issue so it automatically closes when merged.
- e.g. Closes #102 or Fixes #65

## Summary
Provide a high-level explanation of the changes. Why was this PR created? Example: "This PR introduces the logic for validating user achievement tiers based on the new contract specifications in nexus-api."

## Strategies
Explain important strategies and decisions involved in the pull request. Also include your explanation for your conflicts with our coding standards so our the person reviewing your code will understand it better. 

## Additional information 
Provide additional information that could be useful for the reviewer. 