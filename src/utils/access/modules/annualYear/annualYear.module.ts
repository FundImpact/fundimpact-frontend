import { MODULE_CODES } from "../../moduleCodes";
import { ANNUAL_YEAR_ACTIONS } from "./actions";

export const ANNUAL_YEAR_MODULE = {
	name: "Annual Year",
	code: MODULE_CODES.ANNUAL_YEAR,
	actionsAvailable: {
		[ANNUAL_YEAR_ACTIONS.CREATE_ANNUAL_YEAR]: {
			name: "Create Annual Year",
			code: ANNUAL_YEAR_ACTIONS.CREATE_ANNUAL_YEAR,
		},
		[ANNUAL_YEAR_ACTIONS.UPDATE_ANNUAL_YEAR]: {
			name: "Update Annual Year",
			code: ANNUAL_YEAR_ACTIONS.UPDATE_ANNUAL_YEAR,
		},
		[ANNUAL_YEAR_ACTIONS.DELETE_ANNUAL_YEAR]: {
			name: "Delete Annual Year",
			code: ANNUAL_YEAR_ACTIONS.DELETE_ANNUAL_YEAR,
		},
		[ANNUAL_YEAR_ACTIONS.FIND_ANNUAL_YEAR]: {
			name: "Find Annual Year",
			code: ANNUAL_YEAR_ACTIONS.FIND_ANNUAL_YEAR,
		},
	},
};
