import { MODULE_CODES } from "../../moduleCodes";
import { DONOR_ACTIONS } from "./actions";

export const DONOR_MODULE = {
	name: "Donor",
	code: MODULE_CODES.DONOR,
	actionsAvailable: {
		[DONOR_ACTIONS.CREATE_DONOR]: {
			name: "Create Donor",
			code: DONOR_ACTIONS.CREATE_DONOR,
		},
		[DONOR_ACTIONS.UPDATE_DONOR]: {
			name: "Update Donor",
			code: DONOR_ACTIONS.UPDATE_DONOR,
		},
		[DONOR_ACTIONS.DELETE_DONOR]: {
			name: "Delete Donor",
			code: DONOR_ACTIONS.DELETE_DONOR,
		},
		[DONOR_ACTIONS.FIND_DONOR]: {
			name: "Find Donor",
			code: DONOR_ACTIONS.FIND_DONOR,
		},
	},
};
