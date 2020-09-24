import { MODULE_CODES } from "../../moduleCodes";
import { BUDGET_TARGET_ACTIONS } from "./actions";

export const BUDGET_TARGET_MODULE = {
	name: "Budget Target",
	code: MODULE_CODES.BUDGET_TARGET,
	actionsAvailable: {
		[BUDGET_TARGET_ACTIONS.CREATE_BUDGET_TARGET]: {
			name: "Create Budget Target",
			code: BUDGET_TARGET_ACTIONS.CREATE_BUDGET_TARGET,
		},
		[BUDGET_TARGET_ACTIONS.UPDATE_BUDGET_TARGET]: {
			name: "Update Budget Target",
			code: BUDGET_TARGET_ACTIONS.UPDATE_BUDGET_TARGET,
		},
		[BUDGET_TARGET_ACTIONS.DELETE_BUDGET_TARGET]: {
			name: "Delete Budget Target",
			code: BUDGET_TARGET_ACTIONS.DELETE_BUDGET_TARGET,
		},
	},
};
