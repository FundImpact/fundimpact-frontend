import { MODULE_CODES } from "../../moduleCodes";
import { ORGANIZATION_ACTIONS } from "./actions";

export const ORGANIZATION_MODULE = {
	name: "Organization",
	code: MODULE_CODES.ORGANIZATION,
	actionsAvailable: {
		[ORGANIZATION_ACTIONS.UPDATE_ORGANIZATION]: {
			name: "Update Organization",
			code: ORGANIZATION_ACTIONS.UPDATE_ORGANIZATION,
		},
		[ORGANIZATION_ACTIONS.FIND_ORGANIZATION]: {
			name: "Find Organization",
			code: ORGANIZATION_ACTIONS.FIND_ORGANIZATION,
		},
	},
};
