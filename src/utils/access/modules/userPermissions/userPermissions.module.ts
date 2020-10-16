import { MODULE_CODES } from "../../moduleCodes";
import { USER_PERMISSIONS_ACTIONS } from "./actions";

export const USER_PERMISSIONS_MODULE = {
	name: "User Permissions",
	code: MODULE_CODES.USER_PERMISSIONS,
	actionsAvailable: {
		[USER_PERMISSIONS_ACTIONS.CREATE_USER_PERMISSIONS]: {
			name: "Create User Permissions",
			code: USER_PERMISSIONS_ACTIONS.CREATE_USER_PERMISSIONS,
		},
		[USER_PERMISSIONS_ACTIONS.UPDATE_USER_PERMISSIONS]: {
			name: "Update User Permissions",
			code: USER_PERMISSIONS_ACTIONS.UPDATE_USER_PERMISSIONS,
		},
		[USER_PERMISSIONS_ACTIONS.FIND_USER_PERMISSIONS]: {
			name: "Find User Permissions",
			code: USER_PERMISSIONS_ACTIONS.FIND_USER_PERMISSIONS,
		},
	},
};
