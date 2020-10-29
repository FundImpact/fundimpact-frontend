import React, { useMemo } from "react";
import { individualFormFields } from "./inputField.json";
import { IIndividualForm } from "../../models/individual";
import { FORM_ACTIONS } from "../Forms/constant";
import CommonForm from "../CommonForm";
import FormDialog from "../FormDialog";
import { useIntl } from "react-intl";
import { MutationFunctionOptions, FetchResult, useApolloClient, ApolloClient } from "@apollo/client";
import {
	ICreateIndividualVariables,
	ICreateIndividual,
	ICreateIndividualProject,
	ICreateIndividualProjectVariables,
} from "../../models/individual/query.js";
import { IGetProject } from "../../models/project/project.js";
import { useNotificationDispatch } from "../../contexts/notificationContext";
import { setSuccessNotification } from "../../reducers/notificationReducer";
import { GET_INDIVIDUALS } from "../../graphql/Individual";
import { useDashBoardData } from "../../contexts/dashboardContext";

interface IIndividualDialogContainerProps {
	open: boolean;
	handleClose: () => void;
	createIndividual: (
		options?: MutationFunctionOptions<ICreateIndividual, ICreateIndividualVariables> | undefined
	) => Promise<FetchResult<ICreateIndividual, Record<string, any>, Record<string, any>>>;
	loading: boolean;
	projects: IGetProject["orgProject"];
	createIndividualProject: (
		options?:
			| MutationFunctionOptions<ICreateIndividualProject, ICreateIndividualProjectVariables>
			| undefined
	) => Promise<FetchResult<ICreateIndividualProject, Record<string, any>, Record<any, any>>>;
}

interface ISubmitForm {
	valuesSubmitted: IIndividualForm;
	createIndividual: (
		options?: MutationFunctionOptions<ICreateIndividual, ICreateIndividualVariables> | undefined
	) => Promise<FetchResult<ICreateIndividual, Record<string, any>, Record<string, any>>>;
	notificationDispatch: React.Dispatch<any>;
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
}: IAssociateIndividualWithProject) => {
	try {
		return Promise.all(
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
	} catch (err) {
		console.log("err :>> ", err);
	}
};

const submitForm = async ({
	createIndividual,
	notificationDispatch,
	valuesSubmitted,
}: ISubmitForm) => {
	try {
		const individualCreated = await createIndividual({
			variables: {
				input: {
					data: {
						name: valuesSubmitted.name,
					},
				},
			},
		});
		notificationDispatch(setSuccessNotification("Individual Created"));
		return individualCreated;
	} catch (err) {
		notificationDispatch(setSuccessNotification(err.message));
	}
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

function IndividualDialogContainer({
	open,
	handleClose,
	loading,
	createIndividual,
	projects,
	createIndividualProject,
}: IIndividualDialogContainerProps) {
	const initialValues = getInitialFormValues();
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
			const individualCreated = await submitForm({
				valuesSubmitted,
				createIndividual,
				notificationDispatch,
			});
			if (individualCreated && individualCreated.data && valuesSubmitted.project) {
				console.log("individualCreated :>> ", individualCreated);
				await associateIndividualWithProject({
					createIndividualProject,
					projects: valuesSubmitted.project.map((project) => project.id),
					individualId: individualCreated.data.createT4DIndividual.t4DIndividual.id,
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
				formAction={FORM_ACTIONS.CREATE}
				onUpdate={submitForm}
			/>
		</FormDialog>
	);
}

export default IndividualDialogContainer;
