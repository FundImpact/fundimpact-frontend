import { useLazyQuery, useMutation, useApolloClient, ApolloClient } from "@apollo/client";
import React, { useEffect, useState } from "react";

import { useDashBoardData, useDashboardDispatch } from "../../contexts/dashboardContext";
import { useNotificationDispatch } from "../../contexts/notificationContext";
import { GET_ORG_DONOR } from "../../graphql/donor";
import { CREATE_PROJECT_DONOR, UPDATE_PROJECT_DONOR } from "../../graphql/donor/mutation";
import { CREATE_PROJECT, GET_PROJ_DONORS, UPDATE_PROJECT } from "../../graphql/project";
import useMultipleFileUpload from "../../hooks/multipleFileUpload";
import { AttachFile } from "../../models/AttachFile";
import {
	IProject,
	ProjectProps,
	ICreateProjectDonor,
	ICreateProjectDonorVariables,
	IGetProjectDonor,
	ICreateProject,
	IUpdateProjectDonorVariables,
} from "../../models/project/project";
import { IPROJECT_FORM } from "../../models/project/projectForm";
import { setErrorNotification, setSuccessNotification } from "../../reducers/notificationReducer";
import CommonForm from "../CommonForm/commonForm";
import FormDialog from "../FormDialog/FormDialog";
import AttachFileForm from "../Forms/AttachFiles";
import { FullScreenLoader } from "../Loader/Loader";
import { PROJECT_ACTIONS } from "./constants";
import { projectForm } from "./inputField.json";
import { CommonFormTitleFormattedMessage } from "../../utils/commonFormattedMessage";
import { useIntl } from "react-intl";
import { setProject } from "../../reducers/dashboardReducer";
import { GET_PROJECT_COUNT } from "../../graphql/organizationDashboard/query";
import { GET_PROJECTS_BY_WORKSPACE, GET_PROJECTS } from "../../graphql";
import Donor from "../Donor";
import { FORM_ACTIONS } from "../Forms/constant";
import { useDocumentTableDataRefetch } from "../../hooks/document";

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

export const updateProjectDonorCache = ({
	apolloClient,
	projecttDonorCreated,
}: {
	apolloClient: ApolloClient<object>;
	projecttDonorCreated: ICreateProjectDonor;
}) => {
	try {
		let cachedProjectDonors = apolloClient.readQuery<IGetProjectDonor>({
			query: GET_PROJ_DONORS,
			variables: { filter: { project: projecttDonorCreated.createProjDonor.project.id } },
		});
		if (cachedProjectDonors) {
			apolloClient.writeQuery<IGetProjectDonor>({
				query: GET_PROJ_DONORS,
				variables: { filter: { project: projecttDonorCreated.createProjDonor.project.id } },
				data: {
					projectDonors: [
						{ ...projecttDonorCreated?.createProjDonor, deleted: false },
						...cachedProjectDonors.projectDonors,
					],
				},
			});
		}
	} catch (err) {
		console.error(err);
	}
};

const fetchProjectsInWorkspace = async ({
	apolloClient,
	workspaceId,
}: {
	apolloClient: ApolloClient<object>;
	workspaceId: string;
}) => {
	try {
		await apolloClient.query({
			query: GET_PROJECTS_BY_WORKSPACE,
			variables: { filter: { workspace: workspaceId } },
			fetchPolicy: "network-only",
		});
	} catch (err) {
		console.error(err);
	}
};

const fetchOrgProjects = async ({ apolloClient }: { apolloClient: ApolloClient<object> }) => {
	try {
		await apolloClient.query({ query: GET_PROJECTS, fetchPolicy: "network-only" });
	} catch (err) {
		console.error(err);
	}
};

const updateCachedProject = async ({
	apolloClient,
	createdProject,
}: {
	apolloClient: ApolloClient<object>;
	createdProject: ICreateProject["createOrgProject"];
}) => {
	try {
		let cachedProjects = apolloClient.readQuery<{
			orgProject: ICreateProject["createOrgProject"][];
		}>({ query: GET_PROJECTS });
		if (cachedProjects) {
			apolloClient.writeQuery<{
				orgProject: ICreateProject["createOrgProject"][];
			}>({
				query: GET_PROJECTS,
				data: { orgProject: [...cachedProjects.orgProject, createdProject] },
			});
		} else {
			await fetchOrgProjects({ apolloClient });
		}
	} catch (err) {
		await fetchOrgProjects({ apolloClient });
		console.error(err);
	}
};

const getProjectDonorForGivenDonorId = (
	projectDonors: IGetProjectDonor["projectDonors"],
	donorId: string
) => projectDonors?.find((projectDonor) => projectDonor?.donor?.id == donorId);

function Project(props: ProjectProps) {
	const [openDonorDialog, setOpenDonorDialog] = useState<boolean>(false);
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

	const apolloClient = useApolloClient();

	const [workspaceSelected, setWorkspaceSelected] = useState(
		props.type === PROJECT_ACTIONS.UPDATE ? props.data.workspace || "" : ""
	);
	/* Open Attach File Form*/

	projectForm[5].onClick = () => setOpenAttachFiles(true);

	if (projectFilesArray.length) projectForm[5].label = "View Files";
	else projectForm[5].label = "Attach Files";

	if (projectFilesArray.length)
		projectForm[5].textNextToButton = `${projectFilesArray.length} files attached`;
	else projectForm[5].textNextToButton = ``;

	let {
		multiplefileMorph,
		loading: uploadMorphLoading,
		success,
		setSuccess,
	} = useMultipleFileUpload(projectFilesArray, setProjectFilesArray);

	React.useEffect(() => {
		if (success) {
			if (props.reftechOnSuccess) {
				props.reftechOnSuccess();
			} else {
				fetchProjectsInWorkspace({
					apolloClient,
					workspaceId: dashboardData?.project?.workspace?.id,
				});
			}
			setSuccess(false);
			setProjectFilesArray([]);
		}
	}, [success]);

	if (success) props.handleClose();
	const { refetchDocuments } = useDocumentTableDataRefetch({ projectDocumentRefetch: false });

	const [createNewproject, { loading: createLoading }] = useMutation(CREATE_PROJECT, {
		onCompleted(data) {
			if (!data?.createOrgProject?.id) return;
			dashboardDispatch(setProject(data.createOrgProject));
			multiplefileMorph({
				related_id: data.createOrgProject.id,
				related_type: "projects",
				field: "attachments",
			})
				.then(() => refetchDocuments(data.createOrgProject.id))
				.catch((err) => notificationDispatch(setErrorNotification(err?.message)));
		},
	});
	const [createProjectDonor, { loading: creatingProjectDonors }] = useMutation<
		ICreateProjectDonor,
		ICreateProjectDonorVariables
	>(CREATE_PROJECT_DONOR, {
		onCompleted: (data) => {
			updateProjectDonorCache({ apolloClient, projecttDonorCreated: data });
		},
	});

	const [getOrganizationDonors, { data: donors }] = useLazyQuery(GET_ORG_DONOR, {
		onError: (err) => notificationDispatch(setErrorNotification(err?.message)),
	});

	let mappedDonors: any = [];

	if (props.type === PROJECT_ACTIONS.UPDATE) {
		/*Disable already mapped donors*/
		mappedDonors = props?.data?.donor;
		let donorList: any = [];
		donors?.orgDonors?.forEach((fetchedDonor: any) => {
			const isInDonorList = mappedDonors.includes(fetchedDonor?.id);
			if (isInDonorList) donorList.push({ ...fetchedDonor });
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

	const [getProjectDonors, { data: projectDonors }] = useLazyQuery<IGetProjectDonor>(
		GET_PROJ_DONORS
	);

	const [updateProjectDonor, { loading: updatingProjectDonors }] = useMutation<
		ICreateProjectDonor,
		IUpdateProjectDonorVariables
	>(UPDATE_PROJECT_DONOR);

	const projectId = dashboardData?.project?.id;

	useEffect(() => {
		if (projectId) {
			getProjectDonors({
				variables: {
					filter: {
						project: projectId,
					},
				},
			});
		}
	}, [getProjectDonors, projectId]);

	const createOrUpdateProjectDonors = async ({
		projectId,
		donorId,
	}: {
		projectId: string;
		donorId: string;
	}) => {
		try {
			const projectDonorForGivenDonorId = getProjectDonorForGivenDonorId(
				projectDonors?.projectDonors || [],
				donorId
			);
			if (projectDonorForGivenDonorId) {
				await updateProjectDonor({
					variables: {
						id: projectDonorForGivenDonorId.id,
						input: {
							deleted: !projectDonorForGivenDonorId?.deleted,
							donor: projectDonorForGivenDonorId?.donor?.id,
							project: projectDonorForGivenDonorId?.project?.id,
						},
					},
				});
			} else {
				await createProjectDonor({
					variables: {
						input: {
							project: projectId,
							donor: donorId,
						},
					},
				});
			}
		} catch (err) {
			notificationDispatch(setErrorNotification(err?.message));
		}
	};

	const fetchProjectCount = async ({ apolloClient }: { apolloClient: ApolloClient<object> }) => {
		let projectCount = 0;
		try {
			let fetchedProjectCount = await apolloClient.query<{ orgProjectCount: number }>({
				query: GET_PROJECT_COUNT,
				fetchPolicy: "network-only",
			});
			if (fetchedProjectCount) {
				projectCount = fetchedProjectCount.data.orgProjectCount;
			}
		} catch (err) {
			console.error(err);
		}
		return projectCount;
	};

	const updateProjectCount = async ({ apolloClient }: { apolloClient: ApolloClient<object> }) => {
		try {
			let projectCount = getCachedProjectCount({ apolloClient });
			if (!projectCount) {
				await fetchProjectCount({ apolloClient });
				return;
			}
			apolloClient.writeQuery<{ orgProjectCount: number }>({
				query: GET_PROJECT_COUNT,
				data: {
					orgProjectCount: projectCount + 1,
				},
			});
		} catch (err) {
			console.error(err);
		}
	};

	const getCachedProjectCount = ({ apolloClient }: { apolloClient: ApolloClient<object> }) => {
		let projectCount = 0;
		try {
			let cachedProjectCount = apolloClient.readQuery<{ orgProjectCount: number }>({
				query: GET_PROJECT_COUNT,
			});
			if (cachedProjectCount) {
				projectCount = cachedProjectCount.orgProjectCount;
			}
		} catch (err) {
			console.error(err);
		}
		return projectCount;
	};

	const onCreate = async (value: IPROJECT_FORM) => {
		const formData = { ...value };
		let selectDonors = value.donor;
		delete (formData as any).donor;
		try {
			const createdProject = await createNewproject({
				variables: { input: formData },
			});
			await updateProjectCount({ apolloClient });
			createdProject &&
				(await updateCachedProject({
					apolloClient,
					createdProject: createdProject.data.createOrgProject,
				}));
			notificationDispatch(setSuccessNotification("Project Successfully created !"));
			selectDonors.forEach(async (donorId) => {
				await createOrUpdateProjectDonors({
					projectId: createdProject.data.createOrgProject.id,
					donorId,
				});
			});
		} catch (error) {
			notificationDispatch(setErrorNotification(error?.message));
		} finally {
			// props.handleClose();
		}
	};

	const [updateProject, { data: updateResponse, loading: updateLoading }] = useMutation(
		UPDATE_PROJECT,
		{
			onCompleted(data) {
				// setTotalFilesToUpload(projectFilesArray.filter((elem) => !elem.id).length);

				props.handleClose();
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
			let removedDonors =
				mappedDonors?.filter((donor: string) => !formData?.donor?.includes(donor)) || [];
			delete formData.id;
			delete formData.donor;
			delete formData.attachments;
			const updatedResponse = await updateProject({
				variables: { id: projectId, input: formData },
			});
			if (workspaceSelected !== value.workspace) {
				fetchProjectsInWorkspace({
					apolloClient,
					workspaceId: workspaceSelected,
				});
				fetchProjectsInWorkspace({
					apolloClient,
					workspaceId: value.workspace,
				});
			}
			[...newDonors, ...removedDonors].forEach(async (donorId: string) => {
				await createOrUpdateProjectDonors({
					projectId: updatedResponse?.data.updateOrgProject.id,
					donorId,
				});
			});
		} catch (error) {
			notificationDispatch(setErrorNotification(error?.message));
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
	projectForm[4].addNewClick = () => setOpenDonorDialog(true);
	// let uploadingFileMessage = CommonUploadingFilesMessage();
	const intl = useIntl();
	let { newOrEdit } = CommonFormTitleFormattedMessage(props.type);
	return (
		<>
			<Donor
				open={openDonorDialog}
				formAction={FORM_ACTIONS.CREATE}
				handleClose={() => setOpenDonorDialog(false)}
			/>
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
				subtitle={""}
				workspace={props.workspace ? DashBoardData?.workspace?.name : ""}
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
				</>
			</FormDialog>
			{createLoading ? <FullScreenLoader /> : null}
			{updateLoading ? <FullScreenLoader /> : null}
			{creatingProjectDonors ? <FullScreenLoader /> : null}
			{uploadMorphLoading ? <FullScreenLoader /> : null}
			{openAttachFiles && (
				<AttachFileForm
					open={openAttachFiles}
					handleClose={() => setOpenAttachFiles(false)}
					filesArray={projectFilesArray}
					setFilesArray={setProjectFilesArray}
					{...(props.type == PROJECT_ACTIONS.UPDATE
						? {
								uploadApiConfig: {
									ref: "project",
									refId: dashboardData?.project?.id?.toString() || "",
									field: "attachments",
									path: `org-${dashboardData?.organization?.id}/project-${dashboardData?.project?.id}/project`,
								},
						  }
						: {})}
					parentOnSuccessCall={() => {
						if (props.type == PROJECT_ACTIONS.UPDATE) {
							refetchDocuments();
						}
					}}
				/>
			)}
		</>
	);
}

export default Project;
