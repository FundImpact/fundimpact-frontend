import { MODULE_CODES } from "../../moduleCodes";
import { YEARTAG_ACTIONS } from "./actions";

export const YEAR_TAGS_MODULE = {
	name: "YearTag",
	code: MODULE_CODES.YEAR_TAG,
	actionsAvailable: {
		[YEARTAG_ACTIONS.CREATE_YEAR_TAG]: {
			name: "Create YearTag",
			code: YEARTAG_ACTIONS.CREATE_YEAR_TAG,
		},
		[YEARTAG_ACTIONS.UPDATE_YEAR_TAG]: {
			name: "Update YearTag",
			code: YEARTAG_ACTIONS.UPDATE_YEAR_TAG,
		},
		[YEARTAG_ACTIONS.DELETE_YEAR_TAG]: {
			name: "Delete YearTag",
			code: YEARTAG_ACTIONS.DELETE_YEAR_TAG,
		},
		[YEARTAG_ACTIONS.FIND_YEAR_TAG]: {
			name: "Find YearTag",
			code: YEARTAG_ACTIONS.FIND_YEAR_TAG,
		},
		[YEARTAG_ACTIONS.FINDONE_YEAR_TAG]: {
			name: "Find One YearTag",
			code: YEARTAG_ACTIONS.FINDONE_YEAR_TAG,
		},
	},
};
