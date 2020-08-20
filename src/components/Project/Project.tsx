import { useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";

import { CREATE_PROJECT, UPDATE_PROJECT } from "../../graphql/queries/project";
import { IProject, ProjectProps } from "../../models/project/project";
import CreateProject from "../Forms/CreateProject/createProject";
import { FullScreenLoader } from "../Loader/Loader";
import Snackbar from "../Snackbar/Snackbar";
import { PROJECT_ACTIONS } from "./constants";

function getInitialValues(props: ProjectProps) {
	if (props.type === PROJECT_ACTIONS.UPDATE) return { ...props.data };
	return {
		name: "",
		short_name: "",
		description: "",
		workspace: props.workspaces[0].id,
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
		let errors: Partial<IProject> = {};
		if (!values.name && !values.name.length) {
			errors.name = "Name is required";
		}
		if (!values.workspace) {
			errors.workspace = "workspace is required";
		}
		return errors;
	};

	const formState = props.type;
	const workspaces = props.workspaces;
	return (
		<React.Fragment>
			<CreateProject
				{...{
					initialValues,
					formState,
					onCreate,
					onUpdate,
					clearErrors,
					validate,
					workspaces,
				}}
			>
				{props.type === PROJECT_ACTIONS.CREATE && createError ? (
					<Snackbar severity="error" msg={"Create Failed"} />
				) : null}
				{props.type === PROJECT_ACTIONS.UPDATE && updateError ? (
					<Snackbar severity="error" msg={"Update Failed"} />
				) : null}
			</CreateProject>
			{response && response.createOrgProject && response.createOrgProject.name && (
				<Snackbar severity="success" msg={"Successfully created"} />
			)}
			{createLoading ? <FullScreenLoader /> : null}
			{updateLoading ? <FullScreenLoader /> : null}
		</React.Fragment>
	);
}

export default Project;
