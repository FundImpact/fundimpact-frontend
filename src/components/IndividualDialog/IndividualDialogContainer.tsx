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
import { GET_INDIVIDUALS } from "../../graphql/Individual";
import { useDashBoardData } from "../../contexts/dashboardContext";

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

interface ISubmitForm {
	valuesSubmitted: IIndividualForm;
	createIndividual: (
		options?: MutationFunctionOptions<ICreateIndividual, ICreateIndividualVariables> | undefined
	) => Promise<FetchResult<ICreateIndividual, Record<string, any>, Record<string, any>>>;
	notificationDispatch: React.Dispatch<any>;
}

interface ISubmitForm {
	valuesSubmitted: IIndividualForm;
	createIndividual: (
		options?: MutationFunctionOptions<ICreateIndividual, ICreateIndividualVariables> | undefined
	) => Promise<FetchResult<ICreateIndividual, Record<string, any>, Record<string, any>>>;
	notificationDispatch: React.Dispatch<any>;
}

interface ISubmitForm {
	valuesSubmitted: IIndividualForm;
	createIndividual: (
		options?: MutationFunctionOptions<ICreateIndividual, ICreateIndividualVariables> | undefined
	) => Promise<FetchResult<ICreateIndividual, Record<string, any>, Record<string, any>>>;
	notificationDispatch: React.Dispatch<any>;
}

interface ISubmitForm {
	valuesSubmitted: IIndividualForm;
	createIndividual: (
		options?: MutationFunctionOptions<ICreateIndividual, ICreateIndividualVariables> | undefined
	) => Promise<FetchResult<ICreateIndividual, Record<string, any>, Record<string, any>>>;
	notificationDispatch: React.Dispatch<any>;
}

const getInitialFormValues = (): IIndividualForm => {
	return {
		name: "",
		project: [],
	};
};

const refetchIndividuals = async ({
	apolloClient,
	organizationId,
}: {
	apolloClient: ApolloClient<object>;
	organizationId: string;
}) => {
	try {
		// const limit = getInvitedUserCountCachedValue(apolloClient);

		// await apolloClient.query({
		// 	query: GET_INVITED_USER_LIST,
		// 	variables: {
		// 		filter: {},
		// 		limit: limit > 10 ? 10 : limit,
		// 		start: 0,
		// 		sort: "created_at:DESC",
		// 	},
		// 	fetchPolicy: "network-only",
		// });
		await apolloClient.query({
			query: GET_INDIVIDUALS,
			variables: {
				organization: organizationId,
			},
			fetchPolicy: "network-only",
		});
	} catch (err) {
		console.log("err.message :>> ", err.message);
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
}: ISubmitForm) => {
	try {
		let individualCreated, individualUpdated;
		if (formAction == FORM_ACTIONS.CREATE) {
			individualCreated = await createIndividual({
				variables: {
					input: {
						data: {
							name: valuesSubmitted.name,
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
				`Individual ${formAction == FORM_ACTIONS.CREATE ? "Created" : "Updated"}`
			)
		);
		if (formAction == FORM_ACTIONS.CREATE && individualCreated && individualCreated.data) {
			return individualCreated.data.createT4DIndividual.t4DIndividual;
		}
		if (formAction == FORM_ACTIONS.UPDATE && individualUpdated && individualUpdated.data) {
			return individualUpdated.data.updateT4DIndividual.t4DIndividual;
		}
	} catch (err) {
		notificationDispatch(setSuccessNotification(err.message));
	}
	return null;
};

const onCancel = () => {};

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
	console.log("project :>> ", project);
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
	} = props;

	const initialValues =
		props.formAction == FORM_ACTIONS.CREATE
			? getInitialFormValues()
			: getInitialFormValues(props.initialValues);
	const intl = useIntl();
	console.log("projects :>> ", projects);
	(individualFormFields[1].optionsArray as IGetProject["orgProject"]) = useMemo(
		() => sortProjectsToGroupProject(projects.slice() || []),
		[projects]
	);
	const apolloClient = useApolloClient();
	const notificationDispatch = useNotificationDispatch();
	const dashboardData = useDashBoardData();

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
			});
			if (individual) {
				await associateIndividualWithProject({
					createIndividualProject,
					projects: valuesSubmitted.project.map((project) => project.id),
					individualId: individual.id,
				});
			}

			await refetchIndividuals({
				apolloClient,
				organizationId: dashboardData?.organization?.id || "",
			});

			handleClose();
		} catch (err) {
			console.error(err.message);
		}
	};

	const onUpdate = async (valuesSubmitted: IIndividualForm) => {
		try {
			if (props.formAction == FORM_ACTIONS.UPDATE) {
				valuesSubmitted.name != props.initialValues.name &&
					(await submitForm({
						valuesSubmitted,
						createIndividual,
						notificationDispatch,
						updateIndividual,
						individualId: props.initialValues.id,
						formAction: props.formAction,
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
					} catch (err) {
						notificationDispatch(setErrorNotification(err.message));
					}
				}

				if (newAssignedProjectsToIndividual.length || removedProjectIndividuals.length) {
					await refetchIndividuals({
						apolloClient,
						organizationId: dashboardData?.organization?.id || "",
					});
				}

				handleClose();
			}
		} catch (err) {
			console.log(err.message);
		}
	};

	const title = intl.formatMessage({
		id: "individualFormTitle",
		defaultMessage: "Add individual",
		description: `This text will be show on add individual form`,
	});

	return (
		<FormDialog
			handleClose={handleClose}
			open={open}
			loading={loading}
			title={title}
			subtitle={""}
			workspace={""}
			project={""}
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
