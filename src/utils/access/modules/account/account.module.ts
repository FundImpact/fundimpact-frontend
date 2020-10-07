import { MODULE_CODES } from "../../moduleCodes";
import { ACCOUNT_ACTIONS } from "./actions";

export const ACCOUNT_MODULE = {
	name: "Account",
	code: MODULE_CODES.ACCOUNT,
	actionsAvailable: {
		[ACCOUNT_ACTIONS.CREATE_ACCOUNT]: {
			name: "Create Account",
			code: ACCOUNT_ACTIONS.CREATE_ACCOUNT,
		},
		[ACCOUNT_ACTIONS.UPDATE_ACCOUNT]: {
			name: "Update Account",
			code: ACCOUNT_ACTIONS.UPDATE_ACCOUNT,
		},
		[ACCOUNT_ACTIONS.DELETE_ACCOUNT]: {
			name: "Delete Account",
			code: ACCOUNT_ACTIONS.DELETE_ACCOUNT,
		},
		[ACCOUNT_ACTIONS.FIND_ACCOUNT]: {
			name: "Find Account",
			code: ACCOUNT_ACTIONS.FIND_ACCOUNT,
		},
	},
};
