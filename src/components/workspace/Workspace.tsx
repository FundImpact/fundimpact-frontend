import { useApolloClient, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import React, { useEffect } from "react";

import { GET_WORKSPACES } from "../../graphql/queries";
import { CREATE_WORKSPACE, UPDATE_WORKSPACE } from "../../graphql/queries/workspace";
import {
	IWorkspace,
	IWorkspaceData as IWorkspacesData,
	WorkspaceProps,
} from "../../models/workspace/workspace";
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
		organisation: 4,
	};
}

function Workspace(props: WorkspaceProps) {
	let initialValues: IWorkspace = getInitialValues(props);

	const client = useApolloClient();
	useQuery(GET_WORKSPACES);
	let cachedData = client.readQuery<IWorkspacesData>({ query: GET_WORKSPACES });

	let [CreateWorkspace, { data: response, loading }] = useMutation<
		IWorkspace,
		{ payload: { data: Omit<IWorkspace, "id"> | null } }
	>(CREATE_WORKSPACE);

	/**
	 *@summary Whenever a new workspace is created, we need to update the Apollo Cache also.
	 * That logic is inside this hook.
	 */
	useEffect(() => {
		const oldCachedData = client.readQuery<IWorkspacesData>({ query: GET_WORKSPACES });
		const newWorkspace = response ? (response as any)["createWorkspace"]["workspace"] : null;
		if (!newWorkspace) return;

		const newCacheddata = oldCachedData
			? { ...oldCachedData, workspaces: [...oldCachedData.workspaces, newWorkspace] }
			: { workspaces: [newWorkspace] };

		// Write to cache workspace list
		console.log(`new cache data`, newCacheddata);
		client.writeQuery({
			query: GET_WORKSPACES,
			data: newCacheddata,
		});
	}, [response, client]);

	const onCreate = (value: IWorkspace) => {
		console.log(`on Created is called with: `, value);
		CreateWorkspace({
			variables: { payload: { data: { ...value } } },
		});

		console.log("seeting loading to true");
	};

	let [UpdateWorkspace, { error: updateError, data: UpdateResponse }] = useLazyQuery<
		IWorkspace,
		{ payload: Omit<IWorkspace, "id"> | null; workspaceID: number }
	>(UPDATE_WORKSPACE);
	useEffect(() => {
		if (!UpdateResponse) return;
		console.log(`Got update response `, UpdateResponse);
	}, [UpdateResponse]);

	const onUpdate = (value: IWorkspace) => {
		console.log(`on Update is called`);
		console.log("seeting loading to true");
		UpdateWorkspace({ variables: { payload: value, workspaceID: 4 } });
	};

	const clearErrors = () => {
		// console.log(`Clear Errors is called`);
	};

	const validate = () => {
		// console.log(`validate is called`);
	};

	const formState = props.type;

	return (
		<React.Fragment>
			<WorkspaceForm
				{...{ initialValues, formState, onCreate, onUpdate, clearErrors, validate }}
			>
				Total Wrokspaces:
				{cachedData ? cachedData.workspaces.length : "No workpsace yet"}
				{props.type === WORKSPACE_ACTIONS.UPDATE && updateError ? (
					<AlertMsg severity="error" msg={"Update Failed"} />
				) : null}
			</WorkspaceForm>
			{loading ? <FullScreenLoader /> : null}
		</React.Fragment>
	);
}

export default Workspace;
