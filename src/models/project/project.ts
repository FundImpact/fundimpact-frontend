import { ApolloQueryResult, QueryLazyOptions } from "@apollo/client";
import { PROJECT_ACTIONS } from "../../components/Project/constants";
import { IWorkspace } from "../workspace/workspace";
import { IPROJECT_FORM } from "./projectForm";
import { IOrganisationWorkspaces } from "../workspace/query";
import { AttachFile } from "../AttachFile";

export interface IProject {
	id?: number;
	name: string;
	short_name?: string;
	description?: string;
	workspace?: any;
	logframe_tracker: boolean;
}
export type ProjectProps = {
	workspaces: NonNullable<Pick<IWorkspace, "id" | "name">>[];
	open: boolean;
	handleClose: () => void;
	workspace: string;
	// logframe_tracker: boolean;
	reftechOnSuccess?:
		| ((
				variables?: Partial<Record<string, any>> | undefined
		  ) => Promise<ApolloQueryResult<any>>)
		| ((options?: QueryLazyOptions<{ filter: { workspace: any } }> | undefined) => void);
} & (
	| {
			type: PROJECT_ACTIONS.CREATE;
	  }
	| {
			type: PROJECT_ACTIONS.UPDATE;
			data: IPROJECT_FORM;
	  }
);

export interface IGetProject {
	orgProject: {
		id: string;
		name: string;
		workspace: { id: string; name: string };
		logframe_tracker: boolean;
	}[];
}

export interface IGetProjectById {
	project: {
		id: number;
		name: string;
		workspace: IOrganisationWorkspaces;
		short_name: string;
		description: string;
		attachments: AttachFile[];
		logframe_tracker: boolean;
	};
}

export interface ICreateProjectDonor {
	createProjDonor: {
		id: string;
		project: {
			id: string;
			name: string;
		};
		donor: {
			id: string;
			name: string;
		};
	};
}

export interface ICreateProjectDonorVariables {
	input: {
		project: string;
		donor: string;
	};
}

export interface IUpdateProjectDonorVariables {
	id: string;
	input: {
		project: string;
		donor: string;
		deleted: boolean;
	};
}

export interface IGetProjectDonor {
	projectDonors: IProjectDonor[];
}

export interface IProjectDonor {
	id: string;
	project: {
		id: string;
		name: string;
	};
	donor: {
		id: string;
		name: string;
	};
	deleted: boolean;
}
export interface ICreateProject {
	createOrgProject: {
		id: number;
		name: string;
		workspace: IOrganisationWorkspaces;
		short_name: string;
		description: string;
		logframe_tracker: boolean;
	};
}
