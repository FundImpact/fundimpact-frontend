import { IMODULE } from "../../module.interface";
import { MODULE_CODES } from "../../moduleCodes";
import { SETTING_MODULE_ACTION } from "./actions";

export const SETTING_MODULE: IMODULE = {
	name: "setting",
	code: MODULE_CODES.SETTING,
	actionsAvailable: {
		[SETTING_MODULE_ACTION.FIND_SETTING]: {
			name: "View Setting",
			code: SETTING_MODULE_ACTION.FIND_SETTING,
		},
	},
};
