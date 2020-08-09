import { IOrganisation } from "../organisation/types";

export interface IGET_WORKSPACES_BY_ORG {
	orgWorkspaces: IOrganisationWorkspaces[];
}

export interface IOrganisationWorkspaces {
	id: number;
	name: string;
	__typename: string;
	organisation: IOrganisation;
}

export interface IUPDATE_WORKSPACE_Response {
	updateWorkspace: {
		workspace: IOrganisationWorkspaces;
	};
}
