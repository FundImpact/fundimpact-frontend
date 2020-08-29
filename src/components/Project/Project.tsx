import { useMutation } from "@apollo/client";
import React, { useEffect } from "react";
import { useNotificationDispatch } from "../../contexts/notificationContext";
import { GET_ORGANISATIONS } from "../../graphql/queries";
import { CREATE_PROJECT } from "../../graphql/queries/project";
import { IProject, ProjectProps } from "../../models/project/project";
import { setErrorNotification, setSuccessNotification } from "../../reducers/notificationReducer";
import { projectForm } from "../../utils/inputFields.json";
import CommonForm from "../CommonForm/commonForm";
import FormDialog from "../FormDialog/FormDialog";
import { FullScreenLoader } from "../Loader/Loader";
import { PROJECT_ACTIONS } from "./constants";
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
	const DashBoardData = useDashBoardData();
	const notificationDispatch = useNotificationDispatch();
	let initialValues: IProject = getInitialValues(props);
	const [createNewproject, { data: response, loading: createLoading, error }] = useMutation(
		CREATE_PROJECT
	);
	const formAction = props.type;
	const formIsOpen = props.open;
	const onCancel = props.handleClose;
	const workspaces: any = props.workspaces;

	useEffect(() => {
		if (response) {
			notificationDispatch(setSuccessNotification("Project Successfully created !"));
			onCancel();
		}
		if (error) {
			notificationDispatch(setErrorNotification("Project creation Failed !"));
		}
	}, [response, error, notificationDispatch, onCancel]);

	const onCreate = (value: IProject) => {
		createNewproject({
			variables: { input: value },
			refetchQueries: [
				{
					query: GET_ORGANISATIONS,
				},
			],
		});
	};

	// const [updateProject, { data: updateResponse, loading: updateLoading }] = useMutation(
	// 	UPDATE_PROJECT
	// );

	// useEffect(() => {}, [updateResponse]);

	const onUpdate = (value: IProject) => {
		// updateProject({ variables: { payload: value, projectID: 4 } });
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

	projectForm[1].optionsArray = workspaces;
	return (
		<>
			<FormDialog
				title={(formAction === PROJECT_ACTIONS.CREATE ? "New" : "Edit") + " Project"}
				subtitle={"Project"}
				workspace={DashBoardData?.workspace?.name}
				project={DashBoardData?.project?.name}
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
			{/* {updateLoading ? <FullScreenLoader /> : null} */}
		</>
	);
}

export default Project;
