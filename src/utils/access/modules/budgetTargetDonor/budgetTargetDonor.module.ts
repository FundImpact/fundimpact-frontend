import { MODULE_CODES } from "../../moduleCodes";
import { BUDGET_TARGET_DONOR } from "./actions";

export const BUDGET_TARGET_DONOR_MODULE = {
	name: "Budget Target Donor",
	code: MODULE_CODES.BUDGET_TARGET_DONOR,
	actionsAvailable: {
		[BUDGET_TARGET_DONOR.CREATE_BUDGET_TARGET_DONOR]: {
			name: "Create Budget Target Donor",
			code: BUDGET_TARGET_DONOR.CREATE_BUDGET_TARGET_DONOR,
		},
		[BUDGET_TARGET_DONOR.UPDATE_BUDGET_TARGET_DONOR]: {
			name: "Update Budget Target Donor",
			code: BUDGET_TARGET_DONOR.UPDATE_BUDGET_TARGET_DONOR,
		},
		[BUDGET_TARGET_DONOR.DELETE_BUDGET_TARGET_DONOR]: {
			name: "Delete Budget Target Donor",
			code: BUDGET_TARGET_DONOR.DELETE_BUDGET_TARGET_DONOR,
		},
		[BUDGET_TARGET_DONOR.FIND_BUDGET_TARGET_DONOR]: {
			name: "Find Budget Target Donor",
			code: BUDGET_TARGET_DONOR.FIND_BUDGET_TARGET_DONOR,
		},
	},
};
