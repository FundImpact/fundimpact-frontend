import { IMODULE } from "../../module.interface";
import { MODULE_CODES } from "../../modules.list";
import { IMPACT_MODULE_ACTIONS } from "./actions";

export const IMPACT_MODULE: IMODULE = {
	name: "IMPACT",
	code: MODULE_CODES.BUDGET,
	actionsAvailable: {
		[IMPACT_MODULE_ACTIONS.CREATE_TARGET]: {
			name: "Create Target",
			code: IMPACT_MODULE_ACTIONS.CREATE_TARGET,
		},
		[IMPACT_MODULE_ACTIONS.UPDATE_TARGET]: {
			name: "Update Target",
			code: IMPACT_MODULE_ACTIONS.UPDATE_TARGET,
		},
		[IMPACT_MODULE_ACTIONS.DELETE_TARGET]: {
			name: "Delete Target",
			code: IMPACT_MODULE_ACTIONS.DELETE_TARGET,
		},
		[IMPACT_MODULE_ACTIONS.CREATE_CATEGORY]: {
			name: "Create Category",
			code: IMPACT_MODULE_ACTIONS.CREATE_CATEGORY,
		},
		[IMPACT_MODULE_ACTIONS.UPDATE_CATEGORY]: {
			name: "Update Category",
			code: IMPACT_MODULE_ACTIONS.UPDATE_CATEGORY,
		},
		[IMPACT_MODULE_ACTIONS.DELETE_CATEGORY]: {
			name: "Delete Category",
			code: IMPACT_MODULE_ACTIONS.DELETE_CATEGORY,
		},
		[IMPACT_MODULE_ACTIONS.CREATE_UNITS]: {
			name: "Create Unit",
			code: IMPACT_MODULE_ACTIONS.CREATE_UNITS,
		},
		[IMPACT_MODULE_ACTIONS.UPDATE_UNITS]: {
			name: "Update Unit",
			code: IMPACT_MODULE_ACTIONS.UPDATE_UNITS,
		},
		[IMPACT_MODULE_ACTIONS.DELETE_UNITS]: {
			name: "Delete Unit",
			code: IMPACT_MODULE_ACTIONS.DELETE_UNITS,
		},
		[IMPACT_MODULE_ACTIONS.CREATE_REPORT_ACHIEVEMENT]: {
			name: "Report Achievement",
			code: IMPACT_MODULE_ACTIONS.CREATE_REPORT_ACHIEVEMENT,
		},
		[IMPACT_MODULE_ACTIONS.UPDATE_REPORT_ACHIEVEMENT]: {
			name: "Update Achievement",
			code: IMPACT_MODULE_ACTIONS.UPDATE_REPORT_ACHIEVEMENT,
		},
		[IMPACT_MODULE_ACTIONS.DELETE_REPORT_ACHIEVEMENT]: {
			name: "Delete Achievement",
			code: IMPACT_MODULE_ACTIONS.DELETE_REPORT_ACHIEVEMENT,
		},
	},
};
