import { MODULE_CODES } from "../../moduleCodes";
import { CURRENCY_ACTION } from "./actions";

export const CURRENCY_MODULE = {
	name: "Currency",
	code: MODULE_CODES.CURRENCY,
	actionsAvailable: {
		[CURRENCY_ACTION.CREATE_CURRENCY]: {
			name: "Create Currency",
			code: CURRENCY_ACTION.CREATE_CURRENCY,
		},
		[CURRENCY_ACTION.UPDATE_CURRENCY]: {
			name: "Update Currency",
			code: CURRENCY_ACTION.UPDATE_CURRENCY,
		},
		[CURRENCY_ACTION.DELETE_CURRENCY]: {
			name: "Delete Currency",
			code: CURRENCY_ACTION.DELETE_CURRENCY,
		},
		[CURRENCY_ACTION.FIND_CURRENCY]: {
			name: "Find Currency",
			code: CURRENCY_ACTION.FIND_CURRENCY,
		},
	},
};
