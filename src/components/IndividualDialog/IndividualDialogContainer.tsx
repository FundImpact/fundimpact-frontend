import React, { useMemo } from "react";
import { individualFormFields } from "./inputField.json";
import { IIndividualForm, IIndividual } from "../../models/individual";
import { FORM_ACTIONS } from "../Forms/constant";
import CommonForm from "../CommonForm";
import FormDialog from "../FormDialog";
import { useIntl } from "react-intl";
import {
	MutationFunctionOptions,
	FetchResult,
	useApolloClient,
	ApolloClient,
} from "@apollo/client";
import {
	ICreateIndividualVariables,
	ICreateIndividual,
	ICreateIndividualProject,
	ICreateIndividualProjectVariables,
	IUpdateIndividual,
	IUpdateIndividualVariables,
	IDeleteIndividualProject,
	IDeleteIndividualProjectVariables,
} from "../../models/individual/query.js";
import { IGetProject } from "../../models/project/project.js";
import { useNotificationDispatch } from "../../contexts/notificationContext";
import { setSuccessNotification, setErrorNotification } from "../../reducers/notificationReducer";
import { GET_INDIVIDUALS, GET_INDIVIDUALS_COUNT } from "../../graphql/Individual";
import { useDashBoardData } from "../../contexts/dashboardContext";
import { IndividualDialogType } from "../../models/individual/constant";
import DeleteModal from "../DeleteModal";
import { IDashboardDataContext } from "../../models";

type IIndividualDialogContainerProps =
	| {
			open: boolean;
			handleClose: () => void;
			createIndividual: (
				options?:
					| MutationFunctionOptions<ICreateIndividual, ICreateIndividualVariables>
					| undefined
			) => Promise<FetchResult<ICreateIndividual, Record<string, any>, Record<string, any>>>;
			loading: boolean;
			projects: IGetProject["orgProject"];
			formAction: FORM_ACTIONS.CREATE;
			createIndividualProject: (
				options?:
					| MutationFunctionOptions<
							ICreateIndividualProject,
							ICreateIndividualProjectVariables
					  >
					| undefined
			) => Promise<
				FetchResult<ICreateIndividualProject, Record<string, any>, Record<any, any>>
			>;
			updateIndividual: (
				options?:
					| MutationFunctionOptions<IUpdateIndividual, IUpdateIndividualVariables>
					| undefined
			) => Promise<FetchResult<IUpdateIndividual, Record<string, any>, Record<string, any>>>;
			deleteIndividualProject: (
				options?:
					| MutationFunctionOptions<
							IDeleteIndividualProject,
							IDeleteIndividualProjectVariables
					  >
					| undefined
			) => Promise<
				FetchResult<IDeleteIndividualProject, Record<string, any>, Record<any, any>>
			>;
			dialogType: IndividualDialogType;
			deleteIndividual?: boolean;
	  }
	| {
			open: boolean;
			handleClose: () => void;
			formAction: FORM_ACTIONS.UPDATE;
			initialValues: IIndividual;
			createIndividual: (
				options?:
					| MutationFunctionOptions<ICreateIndividual, ICreateIndividualVariables>
					| undefined
			) => Promise<FetchResult<ICreateIndividual, Record<string, any>, Record<string, any>>>;
			loading: boolean;
			projects: IGetProject["orgProject"];
			createIndividualProject: (
				options?:
					| MutationFunctionOptions<
							ICreateIndividualProject,
							ICreateIndividualProjectVariables
					  >
					| undefined
			) => Promise<
				FetchResult<ICreateIndividualProject, Record<string, any>, Record<any, any>>
			>;
			updateIndividual: (
				options?:
					| MutationFunctionOptions<IUpdateIndividual, IUpdateIndividualVariables>
					| undefined
			) => Promise<FetchResult<IUpdateIndividual, Record<string, any>, Record<string, any>>>;
			deleteIndividualProject: (
				options?:
					| MutationFunctionOptions<
							IDeleteIndividualProject,
							IDeleteIndividualProjectVariables
					  >
					| undefined
			) => Promise<
				FetchResult<IDeleteIndividualProject, Record<string, any>, Record<any, any>>
			>;
			dialogType: IndividualDialogType;
			deleteIndividual?: boolean;
	  };

interface ISubmitForm {
	valuesSubmitted: IIndividualForm;
	createIndividual: (
		options?: MutationFunctionOptions<ICreateIndividual, ICreateIndividualVariables> | undefined
	) => Promise<FetchResult<ICreateIndividual, Record<string, any>, Record<string, any>>>;
	updateIndividual: (
		options?: MutationFunctionOptions<IUpdateIndividual, IUpdateIndividualVariables> | undefined
	) => Promise<FetchResult<IUpdateIndividual, Record<string, any>, Record<string, any>>>;
	notificationDispatch: React.Dispatch<any>;
	individualId: string;
	formAction: FORM_ACTIONS;
	organizationId: string;
}

interface IAssociateIndividualWithProject {
	createIndividualProject: (
		options?:
			| MutationFunctionOptions<ICreateIndividualProject, ICreateIndividualProjectVariables>
			| undefined
	) => Promise<FetchResult<ICreateIndividualProject, Record<string, any>, Record<any, any>>>;
	projects: string[];
	individualId: string;
}

const getIndividualCountQueryFilter = ({
	dialogType,
	dashboardData,
}: {
	dialogType: IndividualDialogType;
	dashboardData?: IDashboardDataContext;
}) =>
	dialogType === IndividualDialogType.organization
		? { organization: dashboardData?.organization?.id, deleted: false }
		: { t4d_project_individuals: { project: dashboardData?.project?.id }, deleted: false };

const getInitialFormValues = (individual?: IIndividual): IIndividualForm => {
	if (individual) {
		return {
			name: individual.name,
			project: individual.t4d_project_individuals.map(
				(t4d_project_individual) => t4d_project_individual.project
			),
		};
	}
	return {
		name: "",
		project: [],
	};
};

const getFilterObject = (organizationId: string | null, projectId: string | null) => {
	return organizationId
		? { organization: organizationId }
		: { t4d_project_individuals: { project: projectId } };
};

const getIndividualCountCachedValue = (
	apolloClient: ApolloClient<object>,
	organizationId: string | null,
	projectId: string | null
) => {
	let count = 0;
	try {
		let cachedCount = apolloClient.readQuery({
			query: GET_INDIVIDUALS_COUNT,
			variables: {
				filter: getFilterObject(organizationId, projectId),
			},
		});
		count = cachedCount?.t4DIndividualsConnection?.aggregate?.count;
	} catch (err) {
		console.error(err);
	}
	return count;
};

const changeIndividualCount = (
	apolloClient: ApolloClient<object>,
	organizationId: string | null,
	projectId: string | null,
	increaseCount: boolean = true
) => {
	try {
		const limit = getIndividualCountCachedValue(apolloClient, organizationId, projectId);
		apolloClient.writeQuery({
			query: GET_INDIVIDUALS_COUNT,
			variables: {
				filter: getFilterObject(organizationId, projectId),
			},
			data: {
				t4DIndividualsConnection: {
					aggregate: {
						count: increaseCount ? limit + 1 : limit - 1,
					},
				},
			},
		});
	} catch (err) {
		console.error(err);
	}
};

const refetchIndividuals = async ({
	apolloClient,
	organizationId,
	projectId,
}: {
	apolloClient: ApolloClient<object>;
	organizationId: string | null;
	projectId: string | null;
	increaseCount?: boolean;
}) => {
	try {
		let count = getIndividualCountCachedValue(apolloClient, organizationId, projectId);

		await apolloClient.query({
			query: GET_INDIVIDUALS,
			variables: {
				filter: getFilterObject(organizationId, projectId),
				limit: count > 10 ? 10 : count,
				start: 0,
				sort: "created_at:DESC",
			},
			fetchPolicy: "network-only",
		});
	} catch (err) {
		console.error(err);
	}
};

const associateIndividualWithProject = async ({
	createIndividualProject,
	projects,
	individualId,
}: IAssociateIndividualWithProject) =>
	Promise.all(
		projects.map((project) =>
			createIndividualProject({
				variables: {
					input: {
						data: {
							project: project,
							t4d_individual: individualId,
						},
					},
				},
			})
		)
	);

const submitForm = async ({
	createIndividual,
	notificationDispatch,
	valuesSubmitted,
	individualId,
	updateIndividual,
	formAction,
	organizationId,
}: ISubmitForm) => {
	try {
		let individualCreated, individualUpdated;
		if (formAction === FORM_ACTIONS.CREATE) {
			individualCreated = await createIndividual({
				variables: {
					input: {
						data: {
							name: valuesSubmitted.name,
							organization: organizationId,
						},
					},
				},
			});
		} else {
			individualUpdated = await updateIndividual({
				variables: {
					input: {
						where: {
							id: individualId,
						},
						data: { name: valuesSubmitted.name },
					},
				},
			});
		}
		notificationDispatch(
			setSuccessNotification(
				`Individual ${formAction === FORM_ACTIONS.CREATE ? "Created" : "Updated"}`
			)
		);
		if (formAction === FORM_ACTIONS.CREATE && individualCreated && individualCreated.data) {
			return individualCreated.data.createT4DIndividual.t4DIndividual;
		}
		if (formAction === FORM_ACTIONS.UPDATE && individualUpdated && individualUpdated.data) {
			return individualUpdated.data.updateT4DIndividual.t4DIndividual;
		}
	} catch (err) {
		notificationDispatch(setSuccessNotification(err.message));
	}
	return null;
};

// const onCancel = () => {};

const validate = (values: IIndividualForm) => {
	let errors: Partial<IIndividualForm> = {};
	if (!values.name) {
		errors.name = "Name is required";
	}
	return errors;
};

const sortProjectsToGroupProject = (projects: IGetProject["orgProject"]) =>
	projects.sort((project1, project2) => +project1.workspace.id - +project2.workspace.id);

const getProjectGroupHeading = (project: IGetProject["orgProject"][0]) => {
	return project.workspace.name;
};

const getNewAssignedProjectToIndividual = ({
	initialProjects,
	newProjectsSubmitted,
}: {
	initialProjects: IIndividual["t4d_project_individuals"][0]["project"][];
	newProjectsSubmitted: IIndividual["t4d_project_individuals"][0]["project"][];
}) => {
	const initialProjectIdHash = initialProjects.reduce(
		(projectIdHash: { [key: string]: string }, currentProject) => {
			projectIdHash[currentProject.id] = "1";
			return projectIdHash;
		},
		{}
	);
	return newProjectsSubmitted.filter((project) => !(project.id in initialProjectIdHash));
};

const getRemovedProjectIndividual = ({
	initialProjectIndividuals,
	newProjectsSubmitted,
}: {
	initialProjectIndividuals: IIndividual["t4d_project_individuals"];
	newProjectsSubmitted: IIndividual["t4d_project_individuals"][0]["project"][];
}) => {
	const newProjectIdHash = newProjectsSubmitted.reduce(
		(projectIdHash: { [key: string]: string }, currentProject) => {
			projectIdHash[currentProject.id] = "1";
			return projectIdHash;
		},
		{}
	);
	return initialProjectIndividuals.filter(
		(individualProject) => !(individualProject.project.id in newProjectIdHash)
	);
};

const disassociateIndividualWithProject = async ({
	deleteIndividualProject,
	removedProjectIndividualsId,
}: {
	deleteIndividualProject: (
		options?:
			| MutationFunctionOptions<IDeleteIndividualProject, IDeleteIndividualProjectVariables>
			| undefined
	) => Promise<FetchResult<IDeleteIndividualProject, Record<string, any>, Record<any, any>>>;
	removedProjectIndividualsId: string[];
}) =>
	Promise.all(
		removedProjectIndividualsId.map((id) =>
			deleteIndividualProject({ variables: { input: { where: { id } } } })
		)
	);

const updateIndividualTableInProject = async ({
	projectList,
	apolloClient,
	increaseCount = true,
}: {
	projectList: IIndividual["t4d_project_individuals"][0]["project"][];
	apolloClient: ApolloClient<object>;
	increaseCount?: boolean;
}) => {
	try {
		await Promise.all(
			projectList.map((project) =>
				refetchIndividuals({
					apolloClient,
					organizationId: null,
					projectId: project.id,
				})
			)
		);
		projectList.forEach((project) =>
			changeIndividualCount(apolloClient, null, `${project.id}`, increaseCount)
		);
	} catch (err) {
		console.error(err);
	}
};

function IndividualDialogContainer(props: IIndividualDialogContainerProps) {
	const {
		open,
		handleClose,
		loading,
		createIndividual,
		projects,
		createIndividualProject,
		updateIndividual,
		deleteIndividualProject,
		dialogType,
	} = props;

	if (dialogType === IndividualDialogType.project) {
		individualFormFields[1].hidden = true;
	} else {
		individualFormFields[1].hidden = false;
	}

	const dashboardData = useDashBoardData();
	const initialValues =
		props.formAction === FORM_ACTIONS.CREATE
			? getInitialFormValues()
			: getInitialFormValues(props.initialValues);
	const intl = useIntl();
	(individualFormFields[1].optionsArray as IGetProject["orgProject"]) = useMemo(
		() => sortProjectsToGroupProject(projects.slice() || []),
		[projects]
	);
	const apolloClient = useApolloClient();
	const notificationDispatch = useNotificationDispatch();

	(individualFormFields[1].autoCompleteGroupBy as unknown) = getProjectGroupHeading;

	const onFormSubmit = async (valuesSubmitted: IIndividualForm) => {
		try {
			const individual = await submitForm({
				valuesSubmitted,
				createIndividual,
				notificationDispatch,
				updateIndividual,
				individualId: "",
				formAction: props.formAction,
				organizationId: dashboardData?.organization?.id || "",
			});

			if (individual && dialogType === IndividualDialogType.organization) {
				//if the individual is created and has submitted various projects in form then
				//associating individual with project
				await associateIndividualWithProject({
					createIndividualProject,
					projects: valuesSubmitted.project.map((project) => project.id),
					individualId: individual.id,
				});

				//refetch the user in individual table which is in the organization setting page
				//that is why project is null
				await refetchIndividuals({
					apolloClient,
					organizationId: dashboardData?.organization?.id || "",
					projectId: null,
				});

				//increasing individual count on organization setting page
				changeIndividualCount(apolloClient, dashboardData?.organization?.id || "", null);

				//variouse project have been submitted in the form, now we have to update the
				//individual table present in the project and increasing individual count in the individual
				// table present in each project
				await updateIndividualTableInProject({
					apolloClient,
					projectList: valuesSubmitted.project,
				});
			}

			if (individual && dialogType === IndividualDialogType.project) {
				//if the individual is created and the dialog was open from the project page
				//then the project is already selected that is why picking project from dashboard
				await associateIndividualWithProject({
					createIndividualProject,
					projects: [`${dashboardData?.project?.id}`],
					individualId: individual.id,
				});
				//refetching the individuals present in individual table on dashboard page
				await refetchIndividuals({
					apolloClient,
					organizationId: null,
					projectId: `${dashboardData?.project?.id}` || "",
				});
				//increasing individual count in the individual table present in  project
				changeIndividualCount(apolloClient, null, `${dashboardData?.project?.id}`);

				//refetch the user in individual table which is in the organization setting page
				//that is why project is null
				await refetchIndividuals({
					apolloClient,
					organizationId: dashboardData?.organization?.id || "",
					projectId: null,
				});

				//increasing individual count on organization setting page
				changeIndividualCount(apolloClient, dashboardData?.organization?.id || "", null);
			}

			handleClose();
		} catch (err) {
			console.error(err);
		}
	};

	const onUpdate = async (valuesSubmitted: IIndividualForm) => {
		try {
			if (props.formAction === FORM_ACTIONS.UPDATE) {
				valuesSubmitted.name !== props.initialValues.name &&
					(await submitForm({
						valuesSubmitted,
						createIndividual,
						notificationDispatch,
						updateIndividual,
						individualId: props.initialValues.id,
						formAction: props.formAction,
						organizationId: dashboardData?.organization?.id || "",
					}));

				let newAssignedProjectsToIndividual = getNewAssignedProjectToIndividual({
					initialProjects: initialValues?.project,
					newProjectsSubmitted: valuesSubmitted.project,
				});
				let removedProjectIndividuals = getRemovedProjectIndividual({
					initialProjectIndividuals: props.initialValues.t4d_project_individuals,
					newProjectsSubmitted: valuesSubmitted.project,
				});

				if (newAssignedProjectsToIndividual.length) {
					try {
						await associateIndividualWithProject({
							createIndividualProject,
							projects: newAssignedProjectsToIndividual.map((project) => project.id),
							individualId: props.initialValues.id,
						});
						notificationDispatch(setSuccessNotification("Project assigned"));
						//while updating the individual new projects were assigned to user
						//now we have to update the individual table in the project and
						//we have to increase the individual count  in the project
						await updateIndividualTableInProject({
							apolloClient,
							projectList: newAssignedProjectsToIndividual,
						});
					} catch (err) {
						notificationDispatch(setErrorNotification(err.message));
					}
				}

				if (removedProjectIndividuals.length) {
					try {
						await disassociateIndividualWithProject({
							deleteIndividualProject,
							removedProjectIndividualsId: removedProjectIndividuals.map(
								(projectIndividual) => projectIndividual.id
							),
						});
						notificationDispatch(setSuccessNotification("Project removed"));
						//while updating the individual projects were unassigned to user
						//now we have to update the individual table in the project
						//and we have to decerease the individual count  in the project
						await updateIndividualTableInProject({
							apolloClient,
							projectList: removedProjectIndividuals.map(
								(projectIndividual) => projectIndividual.project
							),
							increaseCount: false,
						});
					} catch (err) {
						notificationDispatch(setErrorNotification(err.message));
					}
				}

				if (newAssignedProjectsToIndividual.length || removedProjectIndividuals.length) {
					dialogType === IndividualDialogType.organization &&
						(await refetchIndividuals({
							apolloClient,
							organizationId: dashboardData?.organization?.id || "",
							projectId: null,
						}));
				}

				handleClose();
			}
		} catch (err) {
			console.error(err);
		}
	};

	const title = intl.formatMessage({
		id: "individualFormTitle",
		defaultMessage: "Add individual",
		description: `This text will be show on add individual form`,
	});

	const onDelete = async () => {
		try {
			if (props.formAction !== FORM_ACTIONS.UPDATE) {
				return;
			}
			const individualValues = { ...props.initialValues };
			delete (individualValues as any)["id"];
			await updateIndividual({
				variables: {
					input: {
						data: {
							name: individualValues.name,
							deleted: true,
						},
						where: {
							id: props.initialValues.id,
						},
					},
				},
				refetchQueries: [
					{
						query: GET_INDIVIDUALS_COUNT,
						variables: {
							filter: getIndividualCountQueryFilter({
								dialogType: IndividualDialogType.project,
								dashboardData,
							}),
						},
					},
					{
						query: GET_INDIVIDUALS_COUNT,
						variables: {
							filter: getIndividualCountQueryFilter({
								dialogType: IndividualDialogType.organization,
								dashboardData,
							}),
						},
					},
				],
			});
			notificationDispatch(setSuccessNotification("Individual Delete Success"));
		} catch (err) {
			notificationDispatch(setErrorNotification(err.message));
		} finally {
			props.handleClose();
		}
	};

	if (props.deleteIndividual) {
		return (
			<DeleteModal
				open={props.open}
				handleClose={props.handleClose}
				onDeleteConformation={onDelete}
				title="Delete Individual"
			/>
		);
	}

	return (
		<FormDialog
			handleClose={handleClose}
			open={open}
			loading={loading}
			title={title}
			subtitle={""}
			workspace={
				dialogType === IndividualDialogType.project
					? dashboardData?.project?.workspace?.name || ""
					: ""
			}
			project={
				dialogType === IndividualDialogType.project
					? dashboardData?.project?.name || ""
					: ""
			}
		>
			<CommonForm
				initialValues={initialValues}
				validate={validate}
				onCreate={onFormSubmit}
				onCancel={handleClose}
				inputFields={individualFormFields}
				formAction={props.formAction}
				onUpdate={onUpdate}
			/>
		</FormDialog>
	);
}

export default IndividualDialogContainer;
