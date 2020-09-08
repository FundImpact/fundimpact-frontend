import { useLazyQuery, useMutation } from "@apollo/client";
import React, { useEffect } from "react";

import { useDashBoardData } from "../../contexts/dashboardContext";
import { useNotificationDispatch } from "../../contexts/notificationContext";
import { GET_PROJECTS_BY_WORKSPACE } from "../../graphql";
import { GET_ORG_DONOR } from "../../graphql/donor";
import { CREATE_PROJECT_DONOR } from "../../graphql/donor/mutation";
import { CREATE_PROJECT, UPDATE_PROJECT } from "../../graphql/project";
import { IProject, ProjectProps } from "../../models/project/project";
import { IPROJECT_FORM } from "../../models/project/projectForm";
import { setErrorNotification, setSuccessNotification } from "../../reducers/notificationReducer";
import CommonForm from "../CommonForm/commonForm";
import FormDialog from "../FormDialog/FormDialog";
import { FullScreenLoader } from "../Loader/Loader";
import { PROJECT_ACTIONS } from "./constants";
import { projectForm } from "./inputField.json";

function getInitialValues(props: ProjectProps): IPROJECT_FORM {
	if (props.type === PROJECT_ACTIONS.UPDATE) return { ...props.data };
	return {
		name: "",
		short_name: "",
		description: "",
		workspace: props.workspaces[0].id,
		donor: [],
	};
}

function Project(props: ProjectProps) {
	const DashBoardData = useDashBoardData();
	const notificationDispatch = useNotificationDispatch();
	const dashboardData = useDashBoardData();
	let initialValues: IPROJECT_FORM = getInitialValues(props);
	const [createNewproject, { loading: createLoading }] = useMutation(CREATE_PROJECT);
	const [createProjectDonor, { loading: creatingProjectDonors }] = useMutation(
		CREATE_PROJECT_DONOR
	);

	const [getOrganizationDonors, { data: donors }] = useLazyQuery(GET_ORG_DONOR, {
		onError: (err) =>
			notificationDispatch(setErrorNotification("Error Occured While Fetching Donors")),
	});

	useEffect(() => {
		if (dashboardData?.organization) {
			getOrganizationDonors({
				variables: {
					filter: {
						organization: dashboardData?.organization?.id,
					},
				},
			});
		}
	}, [dashboardData]);

	const createDonors = async ({ projectId, donorId }: { projectId: string; donorId: string }) => {
		try {
			await createProjectDonor({
				variables: {
					input: {
						project: projectId,
						donor: donorId,
					},
				},
			});
		} catch (err) {
			notificationDispatch(setErrorNotification("Donor creation Failed !"));
		}
	};

	const onCreate = async (value: IPROJECT_FORM) => {
		const formData = { ...value };
		let selectDonors = value.donor;
		delete formData.donor;
		try {
			const createdProject = await createNewproject({
				variables: { input: formData },
				refetchQueries: [
					{
						query: GET_PROJECTS_BY_WORKSPACE,
						variables: { filter: { workspace: value.workspace } },
					},
				],
			});
			notificationDispatch(setSuccessNotification("Project Successfully created !"));
			selectDonors.forEach(async (donorId) => {
				await createDonors({
					projectId: createdProject.data.createOrgProject.id,
					donorId,
				});
			});
		} catch (error) {
			notificationDispatch(setErrorNotification("Project creation Failed !"));
		} finally {
			props.handleClose();
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

	const validate = (values: IPROJECT_FORM) => {
		let errors: Partial<IPROJECT_FORM> = {};
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
	projectForm[4].optionsArray = donors?.orgDonors ? donors.orgDonors : [];
	return (
		<>
			<FormDialog
				title={(formAction === PROJECT_ACTIONS.CREATE ? "New" : "Edit") + " Project"}
				subtitle={"Project"}
				workspace={DashBoardData?.workspace?.name}
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
			{creatingProjectDonors ? <FullScreenLoader /> : null}
		</>
	);
}

export default Project;
