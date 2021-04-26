import { MODULE_CODES } from "../../moduleCodes";
import { GRANT_PERIOD_ACTIONS } from "./actions";

export const GRANT_PERIOD_MODULE = {
	name: "Grant Period",
	code: MODULE_CODES.GRANT_PERIOD,
	actionsAvailable: {
		[GRANT_PERIOD_ACTIONS.CREATE_GRANT_PERIOD]: {
			name: "Create Grant Period",
			code: GRANT_PERIOD_ACTIONS.CREATE_GRANT_PERIOD,
		},
		[GRANT_PERIOD_ACTIONS.UPDATE_GRANT_PERIOD]: {
			name: "Update Grant Period",
			code: GRANT_PERIOD_ACTIONS.UPDATE_GRANT_PERIOD,
		},
		[GRANT_PERIOD_ACTIONS.DELETE_GRANT_PERIOD]: {
			name: "Delete Grant Period",
			code: GRANT_PERIOD_ACTIONS.DELETE_GRANT_PERIOD,
		},
		[GRANT_PERIOD_ACTIONS.FIND_GRANT_PERIOD]: {
			name: "Find Grant Period",
			code: GRANT_PERIOD_ACTIONS.FIND_GRANT_PERIOD,
		},
		[GRANT_PERIOD_ACTIONS.GRANT_PERIOD_IMPORT_FROM_CSV]: {
			name: "create grant periods project from csv",
			code: GRANT_PERIOD_ACTIONS.GRANT_PERIOD_IMPORT_FROM_CSV,
		},
		[GRANT_PERIOD_ACTIONS.GRANT_PERIOD_EXPORT]: {
			name: "Export Grant Period",
			code: GRANT_PERIOD_ACTIONS.GRANT_PERIOD_EXPORT,
		},
	},
};
