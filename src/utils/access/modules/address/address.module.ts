import { MODULE_CODES } from "../../moduleCodes";
import { ADDRESS_ACTIONS } from "./actions";

export const ADDRESS_MODULE = {
	name: "Address",
	code: MODULE_CODES.ADDRESS,
	actionsAvailable: {
		[ADDRESS_ACTIONS.CREATE_ADDRESS]: {
			name: "Create Address",
			code: ADDRESS_ACTIONS.CREATE_ADDRESS,
		},
		[ADDRESS_ACTIONS.UPDATE_ADDRESS]: {
			name: "Update Address",
			code: ADDRESS_ACTIONS.UPDATE_ADDRESS,
		},
		[ADDRESS_ACTIONS.DELETE_ADDRESS]: {
			name: "Delete Address",
			code: ADDRESS_ACTIONS.DELETE_ADDRESS,
		},
		[ADDRESS_ACTIONS.FIND_ADDRESS]: {
			name: "Find Address",
			code: ADDRESS_ACTIONS.FIND_ADDRESS,
		},
	},
};
