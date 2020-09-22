# Description

This contains all the functionality related to our application's user access management.To check if a user has access to certain module, use the method `UserHasAccessFor` that is export by this module.

## HOW TO CREATE A NEW MODULE

To Create a new module, we need to have

1. A Module directory containing its actions and defination.
2. A Module code which can be mapped to the new module.
3. Finally map the new module in `MODULE` inside [module.list.ts](https://github.com/FundImpact/fundimpact-frontend/blob/development/src/utils/access/module.list.ts).

### 1. Creating a module directory

How to create a module directory, go through the [Module GUIDE](https://github.com/FundImpact/fundimpact-frontend/tree/development/src/utils/access/modules/README.md). It has detailed explanation on it.

### 2. Creating a Module Code.

To create a module code, simply add the module code key and its value inside `MODULE_CODES` in [module.list](https://github.com/FundImpact/fundimpact-frontend/blob/development/src/utils/access/module.list.ts) file. While creating a new code, keep its property name in UPPERCASE and value in lowercase for consistency.

### 3. Mapping Module with Module Code.

Once the module is defined, and its codes is created, go to the file [module.list](https://github.com/FundImpact/fundimpact-frontend/blob/development/src/utils/access/module.list.ts).
Inside it, go to the `MODULES`. Here, Added the Module code as the property and Module as its value.
Thats it. The new module is created and ready to us in the application.

## HOW TO TEMPORARILY REMOVE A MODULE

To Remove a module temporarily from the application scope, just remove its mapping in [module.list](https://github.com/FundImpact/fundimpact-frontend/blob/development/src/utils/access/module.list.ts).
Although module exists, it wont be available for our application.

## HOW TO EDIT MODULE CODE

To Edit module code, go to the [module.list](https://github.com/FundImpact/fundimpact-frontend/blob/development/src/utils/access/module.list.ts) file. Inside it, there is `MODULE_CODES`. Edit the code of whatever module you want. Changes will be reflected throughout the application.
