import { MODULE_CODES } from "../../modules.list";
import { BUDGET_MODULE_ACTIONS } from "./actions";

export const BUDGET_MODULE = {
	name: "Budget",
	code: MODULE_CODES.BUDGET,
	actionsAvailable: {
		[BUDGET_MODULE_ACTIONS.CREATE_TARGET]: {
			name: "Create Target",
			code: BUDGET_MODULE_ACTIONS.CREATE_TARGET,
		},
		[BUDGET_MODULE_ACTIONS.UPDATE_TARGET]: {
			name: "Update Target",
			code: BUDGET_MODULE_ACTIONS.UPDATE_TARGET,
		},
		[BUDGET_MODULE_ACTIONS.DELETE_TARGET]: {
			name: "Delete Target",
			code: BUDGET_MODULE_ACTIONS.DELETE_TARGET,
		},
		[BUDGET_MODULE_ACTIONS.CREATE_CATEGORY]: {
			name: "Create Category",
			code: BUDGET_MODULE_ACTIONS.CREATE_CATEGORY,
		},
		[BUDGET_MODULE_ACTIONS.UPDATE_CATEGORY]: {
			name: "Update Category",
			code: BUDGET_MODULE_ACTIONS.UPDATE_CATEGORY,
		},
		[BUDGET_MODULE_ACTIONS.DELETE_CATEGORY]: {
			name: "Delete Category",
			code: BUDGET_MODULE_ACTIONS.DELETE_CATEGORY,
		},
		[BUDGET_MODULE_ACTIONS.CREATE_BUDGET_SPEND]: {
			name: "Delete Category",
			code: BUDGET_MODULE_ACTIONS.CREATE_BUDGET_SPEND,
		},
		[BUDGET_MODULE_ACTIONS.UPDATE_BUDGET_SPEND]: {
			name: "Delete Category",
			code: BUDGET_MODULE_ACTIONS.UPDATE_BUDGET_SPEND,
		},
		[BUDGET_MODULE_ACTIONS.DELETE_BUDGET_SPEND]: {
			name: "Delete Category",
			code: BUDGET_MODULE_ACTIONS.DELETE_BUDGET_SPEND,
		},
	},

	// actionsAvailable: [
	// 	{ name: "Create Target", code: BUDGET_MODULE_ACTIONS.CREATE_TARGET },
	// 	{ name: "Update Target", code: BUDGET_MODULE_ACTIONS.UPDATE_TARGET },
	// 	{ name: "Delete Target", code: BUDGET_MODULE_ACTIONS.DELETE_TARGET },
	// 	{ name: "Create Category", code: BUDGET_MODULE_ACTIONS.CREATE_CATEGORY },
	// 	{ name: "Update Category", code: BUDGET_MODULE_ACTIONS.UPDATE_CATEGORY },
	// 	{ name: "Delete Category", code: BUDGET_MODULE_ACTIONS.DELETE_CATEGORY },
	// 	{ name: "Report Budget Spend", code: BUDGET_MODULE_ACTIONS.CREATE_BUDGET_SPEND },
	// 	{ name: "Update Budget Spend", code: BUDGET_MODULE_ACTIONS.UPDATE_BUDGET_SPEND },
	// 	{ name: "Delete Budget Spend", code: BUDGET_MODULE_ACTIONS.DELETE_BUDGET_SPEND },
	// ],
};
