import { MODULE_CODES } from "../../moduleCodes";
import { FUND_RECEIPT_ACTIONS } from "./actions";

export const FUND_RECEIPT_MODULE = {
	name: "Fund Receipt",
	code: MODULE_CODES.FUND_RECEIPT,
	actionsAvailable: {
		[FUND_RECEIPT_ACTIONS.CREATE_FUND_RECEIPT]: {
			name: "Create Fund Receipt",
			code: FUND_RECEIPT_ACTIONS.CREATE_FUND_RECEIPT,
		},
		[FUND_RECEIPT_ACTIONS.UPDATE_FUND_RECEIPT]: {
			name: "Update Fund Receipt",
			code: FUND_RECEIPT_ACTIONS.UPDATE_FUND_RECEIPT,
		},
		[FUND_RECEIPT_ACTIONS.DELETE_FUND_RECEIPT]: {
			name: "Delete Fund Receipt",
			code: FUND_RECEIPT_ACTIONS.DELETE_FUND_RECEIPT,
		},
		[FUND_RECEIPT_ACTIONS.FIND_FUND_RECEIPT]: {
			name: "Find Fund Receipt",
			code: FUND_RECEIPT_ACTIONS.FIND_FUND_RECEIPT,
		},
	},
};
