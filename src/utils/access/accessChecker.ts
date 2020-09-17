import { MODULE_CODES, MODULES } from "./modules.list";
import { BUDGET_MODULE_ACTIONS } from "./modules/budget/actions";

type actionType<T extends MODULE_CODES> = keyof typeof MODULES[T]["actionsAvailable"];

export const UserHasAccess = <T extends MODULE_CODES>(moduleName: T, action: actionType<T>) => {
	return true;
};

UserHasAccess<MODULE_CODES.BUDGET>(MODULE_CODES.BUDGET, BUDGET_MODULE_ACTIONS.CREATE_BUDGET_SPEND);
