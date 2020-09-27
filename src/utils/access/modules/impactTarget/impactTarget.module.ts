import { MODULE_CODES } from "../../moduleCodes";
import { IMPACT_TARGET_ACTIONS } from "./actions";

export const IMPACT_TARGET_MODULE = {
	name: "Impact Target",
	code: MODULE_CODES.IMPACT_TARGET,
	actionsAvailable: {
		[IMPACT_TARGET_ACTIONS.CREATE_IMPACT_TARGET]: {
			name: "Create Impact Target",
			code: IMPACT_TARGET_ACTIONS.CREATE_IMPACT_TARGET,
		},
		[IMPACT_TARGET_ACTIONS.UPDATE_IMPACT_TARGET]: {
			name: "Update Impact Target",
			code: IMPACT_TARGET_ACTIONS.UPDATE_IMPACT_TARGET,
		},
		[IMPACT_TARGET_ACTIONS.DELETE_IMPACT_TARGET]: {
			name: "Delete Impact Target",
			code: IMPACT_TARGET_ACTIONS.DELETE_IMPACT_TARGET,
		},
		[IMPACT_TARGET_ACTIONS.FIND_IMPACT_TARGET]: {
			name: "Find Impact Target",
			code: IMPACT_TARGET_ACTIONS.FIND_IMPACT_TARGET,
		},
	},
};
