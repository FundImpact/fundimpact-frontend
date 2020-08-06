import { WORKSPACE_ACTIONS } from "../../components/workspace/constants";
import { IWorkspace } from "./workspace";

export interface IWorkspaceFormProps {
	initialValues: IWorkspace;
	onCreate: (values: IWorkspace) => void;
	onUpdate: (values: IWorkspace) => void;
	clearErrors: any;
	validate: any;
	formState: WORKSPACE_ACTIONS.CREATE | WORKSPACE_ACTIONS.UPDATE;
	Close: () => void;
}
