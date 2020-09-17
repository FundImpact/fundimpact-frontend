# Description

This directory contains the modules and its associated actions.
Kindly adhere to following principles while creating a module:

1. Modules must follow the following structure

```
 modules
   |
   |------- moduleA
   |           |
   |           |---- actions.ts // contains all actions for moduleA.
   |           |
   |           |---- moduleA.module.ts // contains the implementation of moduleA
   |
   |
   |------- moduleB
              |
              |----- actions.ts // contains all the actions for moduleB.
              |
              |----- moduleB.module.ts // contains the implementation of moduleB.
```

2. Modules must be of type `IMODULE`;
3. Module's actions must be enums.
4. Module's actions value must be in lowercase and of pascal-case.
