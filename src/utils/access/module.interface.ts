import { MODULE_CODES } from "./modules.list";

export interface IMODULE {
	name: string;
	code: MODULE_CODES;
	actionsAvailable: { [moduleAction: string]: { name: string; code: string } };
}
