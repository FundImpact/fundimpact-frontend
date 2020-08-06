import { useLazyQuery, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";

import { CREATE_WORKSPACE, UPDATE_WORKSPACE } from "../../graphql/queries/workspace";
import { IWorkspace, WorkspaceProps } from "../../models/workspace/workspace";
import AlertMsg from "../AlertMessage";
import WorkspaceForm from "../Forms/workspace/workspaceForm";
import { FullScreenLoader } from "../Loader/Loader";
import { WORKSPACE_ACTIONS } from "./constants";

function getInitialValues(props: WorkspaceProps) {
	if (props.type === WORKSPACE_ACTIONS.UPDATE) return { ...props.data };
	return {
		name: "Testing Workspace",
		short_name: "testing short name",
		description: "some description",
		organisation: 13, // TODO: Take the organiation id from Context provider
	};
}

function Workspace(props: WorkspaceProps) {
	const [initialValues, setinitialValues] = useState(getInitialValues(props));
	// let initialValues: IWorkspace = ;
	const [successMessage, setsuccessMessage] = useState<string>();
	const [errorMessage, seterrorMessage] = useState<string>();
	// let successMessage: string | null = "null";
	// let errorMessage: string | null = null;

	// const client = useApolloClient();
	// useQuery(GET_WORKSPACES);

	/**
	 *@summary Whenever a new workspace is created, we need to update the Apollo Cache also.
	 * That logic is inside this hook.
	 */
	// useEffect(() => {
	// 	const oldCachedData = client.readQuery<IWorkspacesData>({ query: GET_WORKSPACES });
	// 	const newWorkspace = response ? (response as any)["createWorkspace"]["workspace"] : null;
	// 	if (!newWorkspace) return;

	// 	const newCacheddata = oldCachedData
	// 		? { ...oldCachedData, workspaces: [...oldCachedData.workspaces, newWorkspace] }
	// 		: { workspaces: [newWorkspace] };

	// 	// Write to cache workspace list
	// 	console.log(`new cache data`, newCacheddata);
	// 	client.writeQuery({
	// 		query: GET_WORKSPACES,
	// 		data: newCacheddata,
	// 	});
	// }, [response, client]);

	/*********************************
	 *
	 * 	WORKSPACE CREATE
	 *
	 *********************************/
	let [CreateWorkspace, { data: response, loading, error: createError }] = useMutation<
		IWorkspace,
		{ payload: { data: Omit<IWorkspace, "id"> | null } }
	>(CREATE_WORKSPACE);

	const onCreate = (value: IWorkspace) => {
		CreateWorkspace({
			variables: { payload: { data: { ...value } } },
		});
	};

	useEffect(() => {
		console.log(`Created response`, response);

		if (!response) return;
		setinitialValues({ description: "", name: "", short_name: "", organisation: 1 });

		setsuccessMessage("Workspace Created.");
	}, [response]);

	useEffect(() => {
		seterrorMessage("Workspace Creation Failed.");
	}, [createError]);

	/******************************
	 *
	 * WROKSPACE UPDATE
	 *
	 ******************************/

	let [UpdateWorkspace, { error: updateError, data: UpdateResponse }] = useLazyQuery<
		IWorkspace,
		{ payload: Omit<IWorkspace, "id"> | null; workspaceID: number }
	>(UPDATE_WORKSPACE);

	useEffect(() => {
		if (!UpdateResponse) return setsuccessMessage(undefined);
		return setsuccessMessage("Workspace Updated.");
	}, [UpdateResponse]);

	useEffect(() => {
		if (!updateError) return seterrorMessage(undefined);
		return seterrorMessage("Workspace Updation Failed.");
	}, [updateError]);

	const onUpdate = (value: IWorkspace) => {
		UpdateWorkspace({ variables: { payload: value, workspaceID: 4 } });
	};

	const clearErrors = () => {
		console.log(`Clear Errors is called`);
	};

	const validate = () => {
		// console.log(`validate is called`);
	};

	const formState = props.type;

	return (
		<React.Fragment>
			<WorkspaceForm
				initialValues={initialValues}
				formState={formState}
				onCreate={onCreate}
				onUpdate={onUpdate}
				clearErrors={clearErrors}
				validate={validate}
				Close={props.close}
			>
				{successMessage ? <AlertMsg severity={"success"} msg={successMessage} /> : null}
				{errorMessage ? <AlertMsg severity={"error"} msg={errorMessage} /> : null}
			</WorkspaceForm>
			{loading ? <FullScreenLoader /> : null}
		</React.Fragment>
	);
}

export default Workspace;
