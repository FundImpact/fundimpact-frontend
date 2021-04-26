import { MODULE_CODES } from "../../moduleCodes";
import { IMPACT_UNIT_ACTIONS } from "./actions";

export const IMPACT_UNIT_MODULE = {
	name: "Impact Unit",
	code: MODULE_CODES.IMPACT_UNIT,
	actionsAvailable: {
		[IMPACT_UNIT_ACTIONS.CREATE_IMPACT_UNIT]: {
			name: "Create Impact Unit",
			code: IMPACT_UNIT_ACTIONS.CREATE_IMPACT_UNIT,
		},
		[IMPACT_UNIT_ACTIONS.UPDATE_IMPACT_UNIT]: {
			name: "Update Impact Unit",
			code: IMPACT_UNIT_ACTIONS.UPDATE_IMPACT_UNIT,
		},
		[IMPACT_UNIT_ACTIONS.DELETE_IMPACT_UNIT]: {
			name: "Delete Impact Unit",
			code: IMPACT_UNIT_ACTIONS.DELETE_IMPACT_UNIT,
		},
		[IMPACT_UNIT_ACTIONS.FIND_IMPACT_UNIT]: {
			name: "Find Impact Unit",
			code: IMPACT_UNIT_ACTIONS.FIND_IMPACT_UNIT,
		},
		[IMPACT_UNIT_ACTIONS.IMPACT_UNIT_IMPORT_FROM_CSV]: {
			name: "create impact unit org from csv",
			code: IMPACT_UNIT_ACTIONS.IMPACT_UNIT_IMPORT_FROM_CSV,
		},
		[IMPACT_UNIT_ACTIONS.IMPACT_UNIT_EXPORT]: {
			name: "Impact Unit Export",
			code: IMPACT_UNIT_ACTIONS.IMPACT_UNIT_EXPORT,
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
