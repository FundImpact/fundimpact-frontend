import { MODULE_CODES } from "../../moduleCodes";
import { FINANCIAL_YEAR_ACTIONS } from "./actions";

export const FINANCIAL_YEAR_MODULE = {
	name: "Financial Year",
	code: MODULE_CODES.FINANCIAL_YEAR,
	actionsAvailable: {
		[FINANCIAL_YEAR_ACTIONS.CREATE_FINANCIAL_YEAR]: {
			name: "Create Financial Year",
			code: FINANCIAL_YEAR_ACTIONS.CREATE_FINANCIAL_YEAR,
		},
		[FINANCIAL_YEAR_ACTIONS.UPDATE_FINANCIAL_YEAR]: {
			name: "Update Financial Year",
			code: FINANCIAL_YEAR_ACTIONS.UPDATE_FINANCIAL_YEAR,
		},
		[FINANCIAL_YEAR_ACTIONS.DELETE_FINANCIAL_YEAR]: {
			name: "Delete Financial Year",
			code: FINANCIAL_YEAR_ACTIONS.DELETE_FINANCIAL_YEAR,
		},
		[FINANCIAL_YEAR_ACTIONS.FIND_FINANCIAL_YEAR]: {
			name: "Find Financial Year",
			code: FINANCIAL_YEAR_ACTIONS.FIND_FINANCIAL_YEAR,
		},
	},
};
