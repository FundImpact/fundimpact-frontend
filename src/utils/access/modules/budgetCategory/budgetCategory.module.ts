import { MODULE_CODES } from "../../moduleCodes";
import { BUDGET_CATEGORY_ACTIONS } from "./actions";

export const BUDGET_CATEGORY_MODULE = {
	name: "Budget Category",
	code: MODULE_CODES.BUDGET_CATEGORY,
	actionsAvailable: {
		[BUDGET_CATEGORY_ACTIONS.CREATE_BUDGET_CATEGORY]: {
			name: "Create Budget Category",
			code: BUDGET_CATEGORY_ACTIONS.CREATE_BUDGET_CATEGORY,
		},
		[BUDGET_CATEGORY_ACTIONS.UPDATE_BUDGET_CATEGORY]: {
			name: "Update Budget Category",
			code: BUDGET_CATEGORY_ACTIONS.UPDATE_BUDGET_CATEGORY,
		},
		[BUDGET_CATEGORY_ACTIONS.DELETE_BUDGET_CATEGORY]: {
			name: "Delete Budget Category",
			code: BUDGET_CATEGORY_ACTIONS.DELETE_BUDGET_CATEGORY,
		},
		[BUDGET_CATEGORY_ACTIONS.FIND_BUDGET_CATEGORY]: {
			name: "Find Budget Category",
			code: BUDGET_CATEGORY_ACTIONS.FIND_BUDGET_CATEGORY,
		},
		[BUDGET_CATEGORY_ACTIONS.BUDGET_CATEGORY_IMPORT_FROM_CSV]: {
			name: "create budget category org from csv",
			code: BUDGET_CATEGORY_ACTIONS.BUDGET_CATEGORY_IMPORT_FROM_CSV,
		},
		[BUDGET_CATEGORY_ACTIONS.BUDGET_CATEGORY_EXPORT]: {
			name: "Budget Category Export",
			code: BUDGET_CATEGORY_ACTIONS.BUDGET_CATEGORY_EXPORT,
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
