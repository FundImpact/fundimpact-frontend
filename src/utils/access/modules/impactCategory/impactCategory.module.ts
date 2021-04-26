import { MODULE_CODES } from "../../moduleCodes";
import { IMPACT_CATEGORY_ACTIONS } from "./actions";

export const IMPACT_CATEGORY_MODULE = {
	name: "Impact Category",
	code: MODULE_CODES.IMPACT_CATEGORY,
	actionsAvailable: {
		[IMPACT_CATEGORY_ACTIONS.CREATE_IMPACT_CATEGORY]: {
			name: "Create Impact Category",
			code: IMPACT_CATEGORY_ACTIONS.CREATE_IMPACT_CATEGORY,
		},
		[IMPACT_CATEGORY_ACTIONS.UPDATE_IMPACT_CATEGORY]: {
			name: "Update Impact Category",
			code: IMPACT_CATEGORY_ACTIONS.UPDATE_IMPACT_CATEGORY,
		},
		[IMPACT_CATEGORY_ACTIONS.DELETE_IMPACT_CATEGORY]: {
			name: "Delete Impact Category",
			code: IMPACT_CATEGORY_ACTIONS.DELETE_IMPACT_CATEGORY,
		},
		[IMPACT_CATEGORY_ACTIONS.FIND_IMPACT_CATEGORY]: {
			name: "Find Impact Category",
			code: IMPACT_CATEGORY_ACTIONS.FIND_IMPACT_CATEGORY,
		},
		[IMPACT_CATEGORY_ACTIONS.IMPACT_CATEGORY_CREATE_FROM_CSV]: {
			name: "create impact category org from csv",
			code: IMPACT_CATEGORY_ACTIONS.IMPACT_CATEGORY_CREATE_FROM_CSV,
		},
		[IMPACT_CATEGORY_ACTIONS.IMPACT_CATEGORY_EXPORT]: {
			name: "Impact Category Export",
			code: IMPACT_CATEGORY_ACTIONS.IMPACT_CATEGORY_EXPORT,
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
