import { MODULE_CODES } from "../../moduleCodes";
import { PROJECT_DONOR_ACTIONS } from "./actions";

export const PROJECT_DONOR_MODULE = {
	name: "Project Donor",
	code: MODULE_CODES.PROJECT_DONOR,
	actionsAvailable: {
		[PROJECT_DONOR_ACTIONS.CREATE_PROJECT_DONOR]: {
			name: "Create Project Donor",
			code: PROJECT_DONOR_ACTIONS.CREATE_PROJECT_DONOR,
		},
		[PROJECT_DONOR_ACTIONS.UPDATE_PROJECT_DONOR]: {
			name: "Update Project Donor",
			code: PROJECT_DONOR_ACTIONS.UPDATE_PROJECT_DONOR,
		},
		[PROJECT_DONOR_ACTIONS.DELETE_PROJECT_DONOR]: {
			name: "Delete Project Donor",
			code: PROJECT_DONOR_ACTIONS.DELETE_PROJECT_DONOR,
		},
		[PROJECT_DONOR_ACTIONS.FIND_PROJECT_DONOR]: {
			name: "Find Project DOnor",
			code: PROJECT_DONOR_ACTIONS.FIND_PROJECT_DONOR,
		},
	},
};
