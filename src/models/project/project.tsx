import { PROJECT_ACTIONS } from "../../components/Project/constants";

export interface IProject {
	id?: number;
	name: string;
	short_name?: string;
	description?: string;
	workspace?: number | string;
}

export type ProjectProps =
	| { type: PROJECT_ACTIONS.CREATE; workspaces: { id: number; name: string }[] }
	| {
			type: PROJECT_ACTIONS.UPDATE;
			data: IProject;
			workspaces: { id: number; name: string }[];
	  };