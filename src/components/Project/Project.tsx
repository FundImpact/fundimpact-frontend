import { useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";

import { CREATE_PROJECT, UPDATE_PROJECT } from "../../graphql/queries/project";
import { IProject, ProjectProps } from "../../models/project/project";
import FormDialog from "../FormDialog/FormDialog";
import { FullScreenLoader } from "../Loader/Loader";
import { PROJECT_ACTIONS } from "./constants";
import { useNotificationDispatch } from "../../contexts/notificationContext";
import { setErrorNotification, setSuccessNotification } from "../../reducers/notificationReducer";
import ProjectForm from "../Forms/Project/projectForm";

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
	const notificationDispatch = useNotificationDispatch();
	let initialValues: IProject = getInitialValues(props);

	const [createNewproject, { data: response, loading: createLoading }] = useMutation(
		CREATE_PROJECT
	);

	useEffect(() => {
		if (response) {
			notificationDispatch(setSuccessNotification("Impact Target Successfully created !"));
			props.handleClose();
		}
	}, [response]);

	const onCreate = async (value: IProject) => {
		try {
			await createNewproject({ variables: { input: value } });
		} catch (error) {
			notificationDispatch(setErrorNotification("Impact Target creation Failed !"));
		}
	};

	const [updateProject, { data: updateResponse, loading: updateLoading }] = useMutation(
		UPDATE_PROJECT
	);

	useEffect(() => {}, [updateResponse]);

	const onUpdate = (value: IProject) => {
		// updateProject({ variables: { payload: value, projectID: 4 } });
	};

	const clearErrors = (values: IProject) => {};

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
	const formIsOpen = props.open;
	const handleFormOpen = props.handleClose;
	return (
		<>
			<FormDialog
				title={"New Project"}
				subtitle={"create a new Project"}
				workspace={"workspace"}
				open={formIsOpen}
				handleClose={handleFormOpen}
			>
				<ProjectForm
					{...{
						initialValues,
						formState,
						onCreate,
						onUpdate,
						clearErrors,
						validate,
						formIsOpen,
						handleFormOpen,
						workspaces,
					}}
				/>
			</FormDialog>
			{createLoading ? <FullScreenLoader /> : null}
			{updateLoading ? <FullScreenLoader /> : null}
		</>
	);
}

export default Project;
