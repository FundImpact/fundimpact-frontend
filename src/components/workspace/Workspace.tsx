import React from "react";

import { IWorkspace } from "../../models/workspace/workspace";
import WorkspaceForm from "./workspaceForm";

const onCreate = (value: IWorkspace) => {
	console.log(`on Created is called`);
};

const onUpdate = (value: IWorkspace) => {
	console.log(`on Update is called`);
};

const clearErrors = (values: IWorkspace) => {
	console.log(`Clear Errors is called`);
};

const validate = (values: IWorkspace) => {
	console.log(`validate is called`);
};

function Workspace() {
	const initialValues: IWorkspace = {
		name: "TEsting Workspace",
		organisation: 3,
	};

	const formState = "create";

	return (
		<WorkspaceForm
			{...{ initialValues, formState, onCreate, onUpdate, clearErrors, validate }}
		/>
	);
}

export default Workspace;
