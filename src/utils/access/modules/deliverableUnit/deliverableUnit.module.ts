import { MODULE_CODES } from "../../moduleCodes";
import { DELIVERABLE_UNIT_ACTIONS } from "./actions";

export const DELIVERABLE_UNIT_MODULE = {
	name: "Deliverable unit",
	code: MODULE_CODES.DELIVERABLE_UNIT,
	actionsAvailable: {
		[DELIVERABLE_UNIT_ACTIONS.CREATE_DELIVERABLE_UNIT]: {
			name: "Create deliverable unit",
			code: DELIVERABLE_UNIT_ACTIONS.CREATE_DELIVERABLE_UNIT,
		},
		[DELIVERABLE_UNIT_ACTIONS.UPDATE_DELIVERABLE_UNIT]: {
			name: "Update deliverable unit",
			code: DELIVERABLE_UNIT_ACTIONS.UPDATE_DELIVERABLE_UNIT,
		},
		[DELIVERABLE_UNIT_ACTIONS.DELETE_DELIVERABLE_UNIT]: {
			name: "Delete deliverable unit",
			code: DELIVERABLE_UNIT_ACTIONS.DELETE_DELIVERABLE_UNIT,
		},
		[DELIVERABLE_UNIT_ACTIONS.FIND_DELIVERABLE_UNIT]: {
			name: "Find deliverable unit",
			code: DELIVERABLE_UNIT_ACTIONS.FIND_DELIVERABLE_UNIT,
		},
	},
};
