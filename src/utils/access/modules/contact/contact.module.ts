import { MODULE_CODES } from "../../moduleCodes";
import { CONTACT_ACTION } from "./actions";

export const CONTACT_MODULE = {
	name: "Contact",
	code: MODULE_CODES.BUDGET_TARGET_DONOR,
	actionsAvailable: {
		[CONTACT_ACTION.CREATE_CONTACT]: {
			name: "Create Contact",
			code: CONTACT_ACTION.CREATE_CONTACT,
		},
		[CONTACT_ACTION.UPDATE_CONTACT]: {
			name: "Update Contact",
			code: CONTACT_ACTION.UPDATE_CONTACT,
		},
		[CONTACT_ACTION.DELETE_CONTACT]: {
			name: "Delete Contact",
			code: CONTACT_ACTION.DELETE_CONTACT,
		},
		[CONTACT_ACTION.FIND_CONTACT]: {
			name: "Find Contact",
			code: CONTACT_ACTION.FIND_CONTACT,
		},
	},
};
