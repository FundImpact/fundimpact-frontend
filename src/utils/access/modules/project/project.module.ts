import { MODULE_CODES } from "../../moduleCodes";
import { PROJECT_ACTIONS } from "./actions";

export const IMPACT_UNIT_MODULE = {
	name: "Project",
	code: MODULE_CODES.IMPACT_UNIT,
	actionsAvailable: {
		[PROJECT_ACTIONS.CREATE_PROJECT]: {
			name: "Create Project",
			code: PROJECT_ACTIONS.CREATE_PROJECT,
		},
		[PROJECT_ACTIONS.UPDATE_PROJECT]: {
			name: "Update Project",
			code: PROJECT_ACTIONS.UPDATE_PROJECT,
		},
		[PROJECT_ACTIONS.DELETE_PROJECT]: {
			name: "Delete Project",
			code: PROJECT_ACTIONS.DELETE_PROJECT,
		},
		[PROJECT_ACTIONS.FIND_PROJECT]: {
			name: "Find Project",
			code: PROJECT_ACTIONS.FIND_PROJECT,
		},
	},
};
