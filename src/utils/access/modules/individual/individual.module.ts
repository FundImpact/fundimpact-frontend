import { MODULE_CODES } from "../../moduleCodes";
import { INDIVIDUAL_ACTIONS } from "./actions";

export const INDIVIDUAL_MODULE = {
	name: "Individual",
	code: MODULE_CODES.INDIVIDUAL,
	actionsAvailable: {
		[INDIVIDUAL_ACTIONS.CREATE_INDIVIDUAL]: {
			name: "Create Individual",
			code: INDIVIDUAL_ACTIONS.CREATE_INDIVIDUAL,
		},
		[INDIVIDUAL_ACTIONS.UPDATE_INDIVIDUAL]: {
			name: "Update Individual",
			code: INDIVIDUAL_ACTIONS.UPDATE_INDIVIDUAL,
		},
		[INDIVIDUAL_ACTIONS.DELETE_INDIVIDUAL]: {
			name: "Delete Individual",
			code: INDIVIDUAL_ACTIONS.DELETE_INDIVIDUAL,
		},
		[INDIVIDUAL_ACTIONS.FIND_INDIVIDUAL]: {
			name: "Find Individual",
			code: INDIVIDUAL_ACTIONS.FIND_INDIVIDUAL,
		},
		[INDIVIDUAL_ACTIONS.INDIVIDUAL_EXPORT]: {
			name: "Individual Export",
			code: INDIVIDUAL_ACTIONS.INDIVIDUAL_EXPORT,
		},
		[INDIVIDUAL_ACTIONS.INDIVIDUAL_IMPORT]: {
			name: "Individual Import",
			code: INDIVIDUAL_ACTIONS.INDIVIDUAL_IMPORT,
		},
	},
};
