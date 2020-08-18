import { useMutation, useLazyQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";

import { CREATE_PROJECT, UPDATE_PROJECT } from "../../graphql/queries/project";
import { IProject, ProjectProps } from "../../models/project/project";
import { GET_ORGANISATIONS } from "../../graphql/queries/index";
import FormDialog from "../FormDialog/FormDialog";
import { FullScreenLoader } from "../Loader/Loader";
import { PROJECT_ACTIONS } from "./constants";
import { useNotificationDispatch } from "../../contexts/notificationContext";
import { setErrorNotification, setSuccessNotification } from "../../reducers/notificationReducer";
import { projectForm } from "../../utils/inputFields.json";
import CommonForm from "../CommonForm/commonForm";
import { useDashBoardData } from "../../contexts/dashboardContext";
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
	const dashboardData = useDashBoardData();

	let initialValues: IProject = getInitialValues(props);
	const [createNewproject, { data: response, loading: createLoading }] = useMutation(
		CREATE_PROJECT
	);

	useEffect(() => {
		if (response) {
			notificationDispatch(setSuccessNotification("Project Successfully created !"));
			props.handleClose();
		}
	}, [response]);

	const onCreate = async (value: IProject) => {
		try {
			await createNewproject({
				variables: { input: value },
				refetchQueries: [
					{
						query: GET_ORGANISATIONS,
					},
				],
			});
		} catch (error) {
			notificationDispatch(setErrorNotification("Project creation Failed !"));
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

	const formAction = props.type;
	const formIsOpen = props.open;
	const onCancel = props.handleClose;
	const workspaces: any = props.workspaces;
	projectForm[1].optionsArray = workspaces;
	return (
		<>
			<FormDialog
				title={"New Project"}
				subtitle={"create a new Project"}
				workspace={"workspace"}
				open={formIsOpen}
				handleClose={onCancel}
			>
				<CommonForm
					{...{
						initialValues,
						validate,
						onCreate,
						onCancel,
						formAction,
						onUpdate,
						inputFields: projectForm,
					}}
				/>
			</FormDialog>
			{createLoading ? <FullScreenLoader /> : null}
			{updateLoading ? <FullScreenLoader /> : null}
		</>
	);
}

export default Project;
