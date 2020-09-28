import { MODULE_CODES } from "./moduleCodes";

export interface IMODULE {
	name: string;
	code: MODULE_CODES;
	actionsAvailable: { [moduleAction: string]: { name: string; code: string } };
}
