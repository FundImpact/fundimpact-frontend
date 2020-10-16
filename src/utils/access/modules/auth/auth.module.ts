import { MODULE_CODES } from "../../moduleCodes";
import { AUTH_ACTIONS } from "./actions";

export const AUTH_MODULE = {
	name: "Auth",
	code: MODULE_CODES.AUTH,
	actionsAvailable: {
		[AUTH_ACTIONS.INVITE_USER]: {
			name: "Invite User",
			code: AUTH_ACTIONS.INVITE_USER,
		},
		[AUTH_ACTIONS.FIND]: {
			name: "Find User",
			code: AUTH_ACTIONS.FIND,
		},
	},
};
