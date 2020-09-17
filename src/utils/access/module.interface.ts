import { MODULE_CODES } from "./modules.list";

export interface IMODULE {
	name: string;
	code: MODULE_CODES;
	codes: { [key: string]: any };
	// actionsAvailable?: IModuleAction[];
}
