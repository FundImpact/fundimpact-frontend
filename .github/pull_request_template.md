# GUIDELINES

Before you create any PR, make sure it adheres to the following points:

1. No PR should contain more than 5 files.
2. If a PR contains more than 5 files, then it has to contain only 1 feature / fixes without affecting any other functionalities.
3. If a PR contains changes in a file which can affect functionality of other modules,create a seperate PR for that change and add necessary test cases.
4. Add the label / Assignee / Project / Linked Issue (if it is related to an issue) for the PR.
5. If there is any UI changes, add images (before / after) related to it.

## Description

Please include a summary of the change and which issue is fixed. Please also include relevant motivation and context. List any dependencies that are required for this change.

Fixes # (issue)

### Type of change

Please delete options that are not relevant.

-   [ ] Bug fix (non-breaking change which fixes an issue)
-   [ ] New feature (non-breaking change which adds functionality)
-   [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
-   [ ] This change requires a documentation update

## How Has This Been Tested?

Please describe the tests that you ran to verify your changes. Provide instructions so we can reproduce. Please also list any relevant details for your test configuration

-   [ ] Test A
-   [ ] Test B

## Checklist:

-   [ ] My code follows the style guidelines of this project
-   [ ] I have performed a self-review of my own code
-   [ ] I have made corresponding changes to the documentation
-   [ ] My changes generate no new warnings
-   [ ] I have added tests that prove my fix is effective or that my feature works
-   [ ] New and existing unit tests pass locally with my changes
-   [ ] Any dependent changes have been merged and published in downstream modules
