import { WORKSPACE_ACTIONS } from "../../components/workspace/constants";
import { IOrganisation } from "../organisation/types";

export interface IWorkspace {
	id?: string;
	name: string;
	short_name: string;
	description?: string;
	organization: string;
	__typename?: string;
}

/**
 * @description Response that Apollo client will return and  store in its cache
 * when CREATE_WORKSPACE is executed.
 */
export interface IWorkspaceData {
	workspaces: IWorkspace[];
}

export type WorkspaceProps = { close: () => void; organizationId: IOrganisation["id"] } & (
	| { type: WORKSPACE_ACTIONS.CREATE }
	| { type: WORKSPACE_ACTIONS.UPDATE; data: IWorkspace }
);
