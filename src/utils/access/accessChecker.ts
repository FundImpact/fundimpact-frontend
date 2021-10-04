import { MODULES } from "./modules.list";
import { MODULE_CODES } from "./moduleCodes";
import userRoles from "../../hooks/userRoles";

type actionType<T extends MODULE_CODES> = keyof typeof MODULES[T]["actionsAvailable"];

/**
 * @description Check whether loggedin user has access to the given module or not.
 */

function UserHasAccess<T extends MODULE_CODES>(moduleName: T, action: actionType<T>) {
	const { data: userControllerActionHash } = userRoles();
	// console.log("userControllerActionHash", userControllerActionHash, moduleName + "-" + action);
	// console.log("Module & action:", moduleName, action);
	// console.log("userControllerActionHash:", userControllerActionHash);
	if (!userControllerActionHash || !Object.keys(userControllerActionHash).length) {
		return false;
	}
	if (
		moduleName + "-" + action in userControllerActionHash &&
		userControllerActionHash[moduleName + "-" + action]?.enabled
	) {
		return true;
	}
	return false;
}

export default UserHasAccess;
// UserHasAccess<MODULE_CODES.BUDGET>(MODULE_CODES.BUDGET, BUDGET_MODULE_ACTIONS.CREATE_BUDGET_SPEND);
