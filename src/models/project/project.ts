import { PROJECT_ACTIONS } from "../../components/Project/constants";
import { IWorkspace } from "../workspace/workspace";
import { IPROJECT_FORM } from "./projectForm";

export interface IProject {
	id?: number;
	name: string;
	short_name?: string;
	description?: string;
	workspace?: any;
}

export type ProjectProps = {
	workspaces: NonNullable<Pick<IWorkspace, "id" | "name">>[];
	open: boolean;
	handleClose: () => void;
	workspace: string;
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
	orgProject: { id: string; name: string; workspace: { id: string; name: string } }[];
}
