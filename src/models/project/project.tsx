import { PROJECT_ACTIONS } from "../../components/Project/constants";
import { IWorkspace } from "../workspace/workspace";

export interface IProject {
	id?: number;
	name: string;
	short_name?: string;
	description?: string;
	workspace?: number | string;
}

export type ProjectProps =
	| { type: PROJECT_ACTIONS.CREATE; workspaces: NonNullable<Pick<IWorkspace, "id" | "name">>[] }
	| {
			type: PROJECT_ACTIONS.UPDATE;
			data: IProject;
			workspaces: NonNullable<Pick<IWorkspace, "id" | "name">>[];
	  };
