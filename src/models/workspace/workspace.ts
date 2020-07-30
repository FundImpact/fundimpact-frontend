import { WORKSPACE_ACTIONS } from "../../components/workspace/constants";

export interface IWorkspace {
	id?: number;
	name: string;
	short_name?: string;
	description?: string;
	organisation: number;
}

export type WorkspaceProps =
	| { type: WORKSPACE_ACTIONS.CREATE }
	| { type: WORKSPACE_ACTIONS.UPDATE; data: IWorkspace };
