import { MODULE_CODES } from "../../modules.list";
import { DELIVERABLE_MODULE_ACTIONS } from "./actions";

export const DELIVERABLES_MODULE = {
	name: "DELIVERABLES",
	code: MODULE_CODES.BUDGET,
	actionsAvailable: {
		[DELIVERABLE_MODULE_ACTIONS.CREATE_TARGET]: {
			name: "Create Target",
			code: DELIVERABLE_MODULE_ACTIONS.CREATE_TARGET,
		},
		[DELIVERABLE_MODULE_ACTIONS.UPDATE_TARGET]: {
			name: "Update Target",
			code: DELIVERABLE_MODULE_ACTIONS.UPDATE_TARGET,
		},
		[DELIVERABLE_MODULE_ACTIONS.DELETE_TARGET]: {
			name: "Delete Target",
			code: DELIVERABLE_MODULE_ACTIONS.DELETE_TARGET,
		},
		[DELIVERABLE_MODULE_ACTIONS.CREATE_CATEGORY]: {
			name: "Create Category",
			code: DELIVERABLE_MODULE_ACTIONS.CREATE_CATEGORY,
		},
		[DELIVERABLE_MODULE_ACTIONS.UPDATE_CATEGORY]: {
			name: "Update Category",
			code: DELIVERABLE_MODULE_ACTIONS.UPDATE_CATEGORY,
		},
		[DELIVERABLE_MODULE_ACTIONS.DELETE_CATEGORY]: {
			name: "Delete Category",
			code: DELIVERABLE_MODULE_ACTIONS.DELETE_CATEGORY,
		},
		[DELIVERABLE_MODULE_ACTIONS.CREATE_UNITS]: {
			name: "Create Unit",
			code: DELIVERABLE_MODULE_ACTIONS.CREATE_UNITS,
		},
		[DELIVERABLE_MODULE_ACTIONS.UPDATE_UNITS]: {
			name: "Update Unit",
			code: DELIVERABLE_MODULE_ACTIONS.UPDATE_UNITS,
		},
		[DELIVERABLE_MODULE_ACTIONS.DELETE_UNITS]: {
			name: "Delete Unit",
			code: DELIVERABLE_MODULE_ACTIONS.DELETE_UNITS,
		},
		[DELIVERABLE_MODULE_ACTIONS.CREATE_REPORT_ACHIEVEMENT]: {
			name: "Report Achievement",
			code: DELIVERABLE_MODULE_ACTIONS.CREATE_REPORT_ACHIEVEMENT,
		},
		[DELIVERABLE_MODULE_ACTIONS.UPDATE_REPORT_ACHIEVEMENT]: {
			name: "Update Achievement",
			code: DELIVERABLE_MODULE_ACTIONS.UPDATE_REPORT_ACHIEVEMENT,
		},
		[DELIVERABLE_MODULE_ACTIONS.DELETE_REPORT_ACHIEVEMENT]: {
			name: "Delete Achievement",
			code: DELIVERABLE_MODULE_ACTIONS.DELETE_REPORT_ACHIEVEMENT,
		},
	},
};
