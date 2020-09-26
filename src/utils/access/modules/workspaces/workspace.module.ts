import { MODULE_CODES } from "../../moduleCodes";
import { WORKSPACE_ACTIONS } from "./actions";

export const WORKSPACE_MODULE = {
	name: "Workspace",
	code: MODULE_CODES.WORKSPACE,
	actionsAvailable: {
		[WORKSPACE_ACTIONS.CREATE_WORKSPACE]: {
			name: "Create Workspace",
			code: WORKSPACE_ACTIONS.CREATE_WORKSPACE,
		},
		[WORKSPACE_ACTIONS.UPDATE_WORKSPACE]: {
			name: "Update Workspace",
			code: WORKSPACE_ACTIONS.UPDATE_WORKSPACE,
		},
		[WORKSPACE_ACTIONS.DELETE_WORKSPACE]: {
			name: "Delete Workspace",
			code: WORKSPACE_ACTIONS.DELETE_WORKSPACE,
		},
		[WORKSPACE_ACTIONS.FIND_WORKSPACE]: {
			name: "Find Workspace",
			code: WORKSPACE_ACTIONS.FIND_WORKSPACE,
		},
	},
};
