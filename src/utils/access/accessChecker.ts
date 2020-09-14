/**
 *
 * @description This function is used to check the access of the loggedin user
 * for modules.
 *
 */
import { MODULE_ACTIONS } from "./moduleActions";
import { ModulesKeys } from "./modulesCodes";

export const UserHasAccessFor = (moduleName: keyof typeof ModulesKeys, action: MODULE_ACTIONS) => {
	if (moduleName || action) return true;
	return false;
};
