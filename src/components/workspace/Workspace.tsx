import { useLazyQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";

import { CREATE_WORKSPACE, UPDATE_WORKSPACE } from "../../graphql/queries/workspace";
import { IWorkspace, WorkspaceProps } from "../../models/workspace/workspace";
import AlertMsg from "../AlertMessage";
import WorkspaceForm from "../Forms/workspace/workspaceForm";
import { FullScreenLoader } from "../Loader";
import { WORKSPACE_ACTIONS } from "./constants";

function getInitialValues(props: WorkspaceProps) {
	if (props.type === WORKSPACE_ACTIONS.UPDATE) return { ...props.data };
	return {
		name: "Testing Workspace",
		short_name: "testing short name",
		description: "some description",
		organisation: 3,
	};
}

function Workspace(props: WorkspaceProps) {
	let initialValues: IWorkspace = getInitialValues(props);

	let [CreateWorkspace, { error: createError, data: response, loading }] = useLazyQuery<
		IWorkspace,
		{ payload: Omit<IWorkspace, "id"> | null }
	>(CREATE_WORKSPACE);

	useEffect(() => {
		console.log(`Got response `, response);
	}, [response]);

	const onCreate = (value: IWorkspace) => {
		console.log(`on Created is called with: `, value);
		CreateWorkspace({ variables: { payload: value } });

		console.log("seeting loading to true");
	};

	let [
		UpdateWorkspace,
		{ error: updateError, data: UpdateResponse, loading: updateLoading },
	] = useLazyQuery<IWorkspace, { payload: Omit<IWorkspace, "id"> | null; workspaceID: number }>(
		UPDATE_WORKSPACE
	);
	useEffect(() => {
		console.log(`Got update response `, UpdateResponse);
	}, [UpdateResponse]);

	const onUpdate = (value: IWorkspace) => {
		console.log(`on Update is called`);
		console.log("seeting loading to true");
		UpdateWorkspace({ variables: { payload: value, workspaceID: 4 } });
	};

	const clearErrors = (values: IWorkspace) => {
		console.log(`Clear Errors is called`);
	};

	const validate = (values: IWorkspace) => {
		console.log(`validate is called`);
	};

	const formState = props.type;

	return (
		<React.Fragment>
			<WorkspaceForm
				{...{ initialValues, formState, onCreate, onUpdate, clearErrors, validate }}
			>
				{props.type === WORKSPACE_ACTIONS.CREATE && createError ? (
					<AlertMsg severity="error" msg={"Create Failed"} />
				) : null}
				{props.type === WORKSPACE_ACTIONS.UPDATE && updateError ? (
					<AlertMsg severity="error" msg={"Update Failed"} />
				) : null}
			</WorkspaceForm>
			{loading ? <FullScreenLoader /> : null}
		</React.Fragment>
	);
}

export default Workspace;
