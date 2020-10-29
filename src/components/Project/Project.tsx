import { useLazyQuery, useMutation } from "@apollo/client";
import React, { useEffect } from "react";

import { useDashBoardData, useDashboardDispatch } from "../../contexts/dashboardContext";
import { useNotificationDispatch } from "../../contexts/notificationContext";
import { GET_PROJECTS_BY_WORKSPACE, GET_PROJECTS } from "../../graphql";
import { GET_ORG_DONOR } from "../../graphql/donor";
import { CREATE_PROJECT_DONOR } from "../../graphql/donor/mutation";
import { CREATE_PROJECT, GET_PROJ_DONORS, UPDATE_PROJECT } from "../../graphql/project";
import useMultipleFileUpload from "../../hooks/multipleFileUpload";
import { AttachFile } from "../../models/AttachFile";
import { IProject, ProjectProps } from "../../models/project/project";
import { IPROJECT_FORM } from "../../models/project/projectForm";
import { setErrorNotification, setSuccessNotification } from "../../reducers/notificationReducer";
import CommonForm from "../CommonForm/commonForm";
import FormDialog from "../FormDialog/FormDialog";
import AttachFileForm from "../Forms/AttachFiles";
import { FullScreenLoader } from "../Loader/Loader";
import { PROJECT_ACTIONS } from "./constants";
import { projectForm } from "./inputField.json";
import { uploadPercentageCalculator } from "../../utils";
import {
	CommonFormTitleFormattedMessage,
	CommonUploadingFilesMessage,
} from "../../utils/commonFormattedMessage";
import { CircularPercentage } from "../commons";
import { useIntl } from "react-intl";
import { setProject } from "../../reducers/dashboardReducer";

function getInitialValues(props: ProjectProps): IPROJECT_FORM {
	if (props.type === PROJECT_ACTIONS.UPDATE) return { ...props.data };
	return {
		name: "",
		short_name: "",
		description: "",
		workspace: props.workspace,
		donor: [],
	};
}

function Project(props: ProjectProps) {
	const DashBoardData = useDashBoardData();
	const notificationDispatch = useNotificationDispatch();
	const dashboardData = useDashBoardData();
	let initialValues: IPROJECT_FORM = getInitialValues(props);
	const dashboardDispatch = useDashboardDispatch();
	const [openAttachFiles, setOpenAttachFiles] = React.useState<boolean>();
	const [projectFilesArray, setProjectFilesArray] = React.useState<AttachFile[]>(
		props.type === PROJECT_ACTIONS.UPDATE
			? props.data.attachments
				? [...props.data.attachments]
				: []
			: []
	);

	/* Open Attach File Form*/
	projectForm[5].onClick = () => setOpenAttachFiles(true);

	if (projectFilesArray.length) projectForm[5].label = "View Files";
	else projectForm[5].label = "Attach Files";

	let { multiplefileUpload } = useMultipleFileUpload();

	const [totalFilesToUpload, setTotalFilesToUpload] = React.useState(0);
	const [projectUploadSuccess, setProjectUploadSuccess] = React.useState<boolean>(false);
	const [loadingPercentage, setLoadingPercentage] = React.useState(0);

	React.useEffect(() => {
		let remainFilestoUpload = projectFilesArray.filter((elem) => !elem.id).length;
		let percentage = uploadPercentageCalculator(remainFilestoUpload, totalFilesToUpload);
		setLoadingPercentage(percentage);
	}, [projectFilesArray, totalFilesToUpload]);

	React.useEffect(() => {
		if (projectUploadSuccess) {
			props.handleClose();
			if (props.reftechOnSuccess) {
				props.reftechOnSuccess();
			}
			setProjectUploadSuccess(false);
		}
	}, [projectUploadSuccess]);
	const successMessage = () => {
		if (totalFilesToUpload) notificationDispatch(setSuccessNotification("Files Uploaded !"));
	};
	if (projectUploadSuccess) successMessage();

	const [createNewproject, { loading: createLoading }] = useMutation(CREATE_PROJECT, {
		onCompleted(data) {
			dashboardDispatch(setProject(data.createOrgProject));
			setTotalFilesToUpload(projectFilesArray.filter((elem) => !elem.id).length);
			multiplefileUpload({
				ref: "project",
				refId: data.createOrgProject.id,
				field: "attachments",
				path: `org-${DashBoardData?.organization?.id}/projects`,
				filesArray: projectFilesArray,
				setFilesArray: setProjectFilesArray,
				setUploadSuccess: setProjectUploadSuccess,
			});

			setProjectFilesArray([]);
		},
	});
	const [createProjectDonor, { loading: creatingProjectDonors }] = useMutation(
		CREATE_PROJECT_DONOR
	);

	const [getOrganizationDonors, { data: donors }] = useLazyQuery(GET_ORG_DONOR, {
		onError: (err) =>
			notificationDispatch(setErrorNotification("Error Occured While Fetching Donors")),
	});

	let mappedDonors: any = [];

	projectForm[1].disabled = false;
	if (props.type === PROJECT_ACTIONS.UPDATE) {
		/*Disable workspace field*/
		projectForm[1].disabled = true;
		/*Disable already mapped donors*/
		mappedDonors = props?.data?.donor;
		let donorList: any = [];
		donors?.orgDonors?.forEach((fetchedDonor: any) => {
			const isInDonorList = mappedDonors.includes(fetchedDonor?.id);
			if (isInDonorList) donorList.push({ ...fetchedDonor, disabled: true });
			else donorList.push(fetchedDonor);
		});
		projectForm[4].optionsArray = donorList;
	} else projectForm[4].optionsArray = donors?.orgDonors ? donors.orgDonors : [];

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
		delete (formData as any).donor;
		try {
			const createdProject = await createNewproject({
				variables: { input: formData },
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
			// props.handleClose();
		}
	};

	const [updateProject, { data: updateResponse, loading: updateLoading }] = useMutation(
		UPDATE_PROJECT,
		{
			onCompleted(data) {
				setTotalFilesToUpload(projectFilesArray.filter((elem) => !elem.id).length);
				multiplefileUpload({
					ref: "project",
					refId: data.updateOrgProject.id,
					field: "attachments",
					path: `org-${DashBoardData?.organization?.id}/projects`,
					filesArray: projectFilesArray,
					setFilesArray: setProjectFilesArray,
					setUploadSuccess: setProjectUploadSuccess,
				});

				setProjectFilesArray([]);

				notificationDispatch(setSuccessNotification("Project Successfully updated !"));
			},
		}
	);

	const onUpdate = async (value: IPROJECT_FORM) => {
		// updateProject({ variables: { payload: value, projectID: 4 } });

		try {
			let formData: any = { ...value };
			let projectId = formData.id;
			let newDonors = formData?.donor?.filter(function (el: string) {
				return !mappedDonors.includes(el);
			});
			delete formData.id;
			delete formData.donor;
			delete formData.attachments;
			const updatedResponse = await updateProject({
				variables: { id: projectId, input: formData },
			});
			newDonors.forEach(async (donorId: string) => {
				await createDonors({
					projectId: updatedResponse?.data.updateOrgProject.id,
					donorId,
				});
			});
		} catch (error) {
			notificationDispatch(setErrorNotification("Project creation Failed !"));
		} finally {
			// props.handleClose();
		}
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
	let uploadingFileMessage = CommonUploadingFilesMessage();
	const intl = useIntl();
	let { newOrEdit } = CommonFormTitleFormattedMessage(props.type);
	return (
		<>
			<FormDialog
				title={
					newOrEdit +
					" " +
					intl.formatMessage({
						id: "projectTargetFormTitle",
						defaultMessage: "Project",
						description: `This text will be show on Project form for title`,
					})
				}
				subtitle={intl.formatMessage({
					id: "projectFormSubtitle",
					defaultMessage:
						"Physical addresses of your organisation like headquarter branch etc",
					description: `This text will be show on Project form for subtitle`,
				})}
				workspace={DashBoardData?.workspace?.name}
				open={formIsOpen}
				handleClose={onCancel}
				loading={createLoading || updateLoading || creatingProjectDonors}
			>
				<>
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
					{loadingPercentage > 0 ? (
						<CircularPercentage
							progress={loadingPercentage}
							message={uploadingFileMessage}
						/>
					) : null}
				</>
			</FormDialog>
			{createLoading ? <FullScreenLoader /> : null}
			{updateLoading ? <FullScreenLoader /> : null}
			{creatingProjectDonors ? <FullScreenLoader /> : null}
			{openAttachFiles && (
				<AttachFileForm
					open={openAttachFiles}
					handleClose={() => setOpenAttachFiles(false)}
					filesArray={projectFilesArray}
					setFilesArray={setProjectFilesArray}
				/>
			)}
		</>
	);
}

export default Project;
