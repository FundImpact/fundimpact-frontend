import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import React, { useEffect } from "react";

import { CREATE_PROJECT, UPDATE_PROJECT } from "../../graphql/queries/project";
import { IProject, ProjectProps } from "../../models/project/project";
import AlertMsg from "../AlertMessage/AlertMessage";
import CreateProject from "../Forms/CreateProject/createProject";
import { FullScreenLoader } from "../Loader/Loader";
import { PROJECT_ACTIONS } from "./constants";

function getInitialValues(props: ProjectProps) {
	if (props.type === PROJECT_ACTIONS.UPDATE) return { ...props.data };
	return {
		name: "Testing Project",
		short_name: "testing short name",
		description: "",
		workspace: props.workspace[0].id,
	};
}

function Project(props: ProjectProps) {
	let initialValues: IProject = getInitialValues(props);

	const [
		createNewproject,
		{ data: response, loading: createLoading, error: createError },
	] = useMutation(CREATE_PROJECT);

	useEffect(() => {
		if (response) {
			console.log(`Got response `, response);
			window.location.reload(false);
		}
	}, [response]);

	const onCreate = (value: IProject) => {
		console.log(`on Created is called with: `, value);
		createNewproject({ variables: { input: value } });

		console.log("seeting loading to true");
	};

	const [
		updateProject,
		{ data: updateResponse, loading: updateLoading, error: updateError },
	] = useMutation(UPDATE_PROJECT);
	useEffect(() => {
		console.log(`Got update response `, updateResponse);
	}, [updateResponse]);

	const onUpdate = (value: IProject) => {
		console.log(`on Update is called`);
		console.log("seeting loading to true");
		// updateProject({ variables: { payload: value, projectID: 4 } });
	};

	const clearErrors = (values: IProject) => {
		console.log(`Clear Errors is called`);
	};

	const validate = (values: IProject) => {
		console.log(`validate is called`);
	};

	const formState = props.type;
	const workspace = props.workspace ? props.workspace : null;
	return (
		<React.Fragment>
			{!response && (
				<CreateProject
					{...{
						initialValues,
						formState,
						onCreate,
						onUpdate,
						clearErrors,
						validate,
						workspace,
					}}
				>
					{props.type === PROJECT_ACTIONS.CREATE && createError ? (
						<AlertMsg severity="error" msg={"Create Failed"} />
					) : null}
					{props.type === PROJECT_ACTIONS.UPDATE && updateError ? (
						<AlertMsg severity="error" msg={"Update Failed"} />
					) : null}
				</CreateProject>
			)}
			{response && <AlertMsg severity="success" msg={"Successfully created"} />}
			{createLoading ? <FullScreenLoader /> : null}
		</React.Fragment>
	);
}

export default Project;
