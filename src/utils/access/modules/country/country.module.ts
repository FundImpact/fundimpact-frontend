import { MODULE_CODES } from "../../moduleCodes";
import { COUNTRY_ACTION } from "./actions";

export const COUNTRY_MODULE = {
	name: "Country",
	code: MODULE_CODES.BUDGET_TARGET_DONOR,
	actionsAvailable: {
		[COUNTRY_ACTION.CREATE_COUNTRY]: {
			name: "Create Country",
			code: COUNTRY_ACTION.CREATE_COUNTRY,
		},
		[COUNTRY_ACTION.UPDATE_COUNTRY]: {
			name: "Update Country",
			code: COUNTRY_ACTION.UPDATE_COUNTRY,
		},
		[COUNTRY_ACTION.DELETE_COUNTRY]: {
			name: "Delete Country",
			code: COUNTRY_ACTION.DELETE_COUNTRY,
		},
		[COUNTRY_ACTION.FIND_COUNTRY]: {
			name: "Find Country",
			code: COUNTRY_ACTION.FIND_COUNTRY,
		},
	},
};
