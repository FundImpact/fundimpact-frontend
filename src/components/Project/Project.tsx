import { useLazyQuery, useMutation } from "@apollo/client";
import React, { useEffect } from "react";

import { CREATE_PROJECT, UPDATE_PROJECT } from "../../graphql/queries/project";
import { IProject, ProjectProps } from "../../models/project/project";
import AlertMsg from "../AlertMessage";
import CreateProject from "../Forms/CreateProject/createProject";
import { FullScreenLoader } from "../Loader/Loader";
import { PROJECT_ACTIONS } from "./constants";

function getInitialValues(props: ProjectProps) {
	if (props.type === PROJECT_ACTIONS.UPDATE) return { ...props.data };
	return {
		name: "Testing Project",
		short_name: "testing short name",
		description: "some description",
		workspace: 5,
	};
}

function Project(props: ProjectProps) {
	let initialValues: IProject = getInitialValues(props);
	const [createNewproject, { data: response, loading, error: createError }] = useMutation(
		CREATE_PROJECT
	);
	// let [CreateNewProjects, { error: createError, data: response, loading }] = useLazyQuery<
	// 	IProject,
	// 	{ payload: Omit<IProject, "id"> | null }
	// >(CREATE_PROJECT);

	useEffect(() => {
		console.log(`Got response `, response);
	}, [response]);

	const onCreate = (value: IProject) => {
		console.log(`on Created is called with: `, value);
		createNewproject({ variables: { input: value } });

		console.log("seeting loading to true");
	};

	let [
		UpdateProject,
		{ error: updateError, data: UpdateResponse, loading: updateLoading },
	] = useLazyQuery<IProject, { payload: Omit<IProject, "id"> | null; projectID: number }>(
		UPDATE_PROJECT
	);
	useEffect(() => {
		console.log(`Got update response `, UpdateResponse);
	}, [UpdateResponse]);

	const onUpdate = (value: IProject) => {
		console.log(`on Update is called`);
		console.log("seeting loading to true");
		UpdateProject({ variables: { payload: value, projectID: 4 } });
	};

	const clearErrors = (values: IProject) => {
		console.log(`Clear Errors is called`);
	};

	const validate = (values: IProject) => {
		console.log(`validate is called`);
	};

	const formState = props.type;

	return (
		<React.Fragment>
			{!response && (
				<CreateProject
					{...{ initialValues, formState, onCreate, onUpdate, clearErrors, validate }}
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
			{loading ? <FullScreenLoader /> : null}
		</React.Fragment>
	);
}

export default Project;
