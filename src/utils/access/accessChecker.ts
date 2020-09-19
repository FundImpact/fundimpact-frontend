import { MODULE_CODES, MODULES } from "./modules.list";

type actionType<T extends MODULE_CODES> = keyof typeof MODULES[T]["actionsAvailable"];

/**
 * @description Check whether loggedin user has access to the given module or not.
 */
export const userHasAccess = <T extends MODULE_CODES>(moduleName: T, action: actionType<T>) => {
	return true;
};

// UserHasAccess<MODULE_CODES.BUDGET>(MODULE_CODES.BUDGET, BUDGET_MODULE_ACTIONS.CREATE_BUDGET_SPEND);
