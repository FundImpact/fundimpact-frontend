import { IOrganisation } from "../organisation/types";

export interface IGET_WORKSPACES_BY_ORG {
	orgWorkspaces: IOrganisationWorkspaces[];
}

export interface IOrganisationWorkspaces {
	id: string;
	name: string;
	__typename: string;
	organization: IOrganisation;
	logframe_tracker: boolean;
}

export interface IUPDATE_WORKSPACE_Response {
	updateWorkspace: {
		workspace: IOrganisationWorkspaces;
	};
}

export interface ICreate_Workspace_Response {
	createWorkspace: {
		__typename: string;
		workspace: IOrganisationWorkspaces;
	};
}
