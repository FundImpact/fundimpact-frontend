import { ApolloCache } from "@apollo/client";

import { IOrganisation } from "../../../models/organisation/types";
import {
	ICreate_Workspace_Response,
	IOrganisationWorkspaces,
	IUPDATE_WORKSPACE_Response,
} from "../../../models/workspace/query";

interface WorkspaceUpdate {
	action: "UPDATE";
	cache: ApolloCache<IUPDATE_WORKSPACE_Response>;
}

interface WorkspaceCreate {
	action: "INSERT";
	cache: ApolloCache<ICreate_Workspace_Response>;
}

export type TWorkspaceUpdate = {
	organizationId: IOrganisation["id"];
	newWorkspace: IOrganisationWorkspaces;
} & (WorkspaceUpdate | WorkspaceCreate);
