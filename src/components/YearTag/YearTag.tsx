import { useLazyQuery, useMutation, ApolloClient, useApolloClient } from "@apollo/client";
import React, { useEffect } from "react";

import { useDashBoardData } from "../../contexts/dashboardContext";
import { useNotificationDispatch } from "../../contexts/notificationContext";
import { GET_COUNTRY_LIST } from "../../graphql/";
import { GET_DONOR_COUNT, GET_ORG_DONOR } from "../../graphql/donor";
import {
	CREATE_ORG_DONOR,
	UPDATE_ORG_DONOR,
	CREATE_PROJECT_DONOR,
} from "../../graphql/donor/mutation";
// import { IInputField } from "../../models";
import { FORM_ACTIONS } from "../../models/constants";
import { IDONOR, IDonorProps } from "../../models/donor";
import { IYearTag, IYearTagProps } from "../../models/yearTags";
import { IGET_DONOR } from "../../models/donor/query";
import { setErrorNotification, setSuccessNotification } from "../../reducers/notificationReducer";
import { compareObjectKeys } from "../../utils";
import { removeEmptyKeys } from "../../utils";
import FormDialog from "../FormDialog";
import CommonForm from "../CommonForm";
import { addYearTagForm } from "./inputField.json";
import { useIntl } from "react-intl";
import { DONOR_DIALOG_TYPE } from "../../models/donor/constants";
import {
	ICreateProjectDonor,
	IGetProjectDonor,
	ICreateProjectDonorVariables,
} from "../../models/project/project";
import { GET_PROJ_DONORS } from "../../graphql/project";
import DeleteModal from "../DeleteModal";
import { CREATE_YEAR_TAG } from "../../graphql/yearTags/mutation";

const defaultFormValues: IYearTag = {
	type: "annual",
	name: "",
	start_date: new Date(),
	end_date: new Date(),
};

const validate = (values: IYearTag) => {
	let errors: Partial<IYearTag> = {};
	// if (!values.label) {
	// 	errors.label = "Label is required";
	// }
	return errors;
};

// const updateYearTagCache = ({
// 	projectDonorCreated,
// 	apolloClient,
// }: {
// 	projectDonorCreated: ICreateProjectDonor;
// 	apolloClient: ApolloClient<object>;
// }) => {
// 	try {
// 		let cachedProjectDonors = apolloClient.readQuery<IGetProjectDonor>({
// 			query: GET_PROJ_DONORS,
// 			variables: { filter: { project: projectDonorCreated.createProjDonor.project.id } },
// 		});
// 		if (cachedProjectDonors) {
// 			apolloClient.writeQuery<IGetProjectDonor>({
// 				query: GET_PROJ_DONORS,
// 				variables: { filter: { project: projectDonorCreated.createProjDonor.project.id } },
// 				data: {
// 					projectDonors: [
// 						{ ...projectDonorCreated?.createProjDonor, deleted: false },
// 						...cachedProjectDonors.projectDonors,
// 					],
// 				},
// 			});
// 		}
// 	} catch (err) {
// 		console.error(err);
// 	}
// };

function YearTag(props: IYearTagProps) {
	const [createDonor, { loading: creatingDonor }] = useMutation(CREATE_ORG_DONOR);
	const [createYearTag, { loading: creatingYearTag }] = useMutation(CREATE_YEAR_TAG);
	const [updateDonor, { loading: updatingDonor }] = useMutation(UPDATE_ORG_DONOR);
	const [getCountryList, { data: countryList }] = useLazyQuery(GET_COUNTRY_LIST);

	const apolloClient = useApolloClient();

	// const [createProjectDonor, { loading: creatingProjectDonors }] = useMutation<
	// 	ICreateProjectDonor,
	// 	ICreateProjectDonorVariables
	// >(CREATE_PROJECT_DONOR, {
	// 	onCompleted: (data) => {
	// 		updateYearTagCache({ apolloClient, projectDonorCreated: data });
	// 	},
	// 	onError: (error) => console.error(error),
	// });

	// addYearTagForm[3].optionsArray = countryList?.countries || [];
	const initialValues =
		props.formAction === FORM_ACTIONS.CREATE ? defaultFormValues : props.initialValues;

	const notificationDispatch = useNotificationDispatch();

	const dashboardData = useDashBoardData();

	const onCreate = async (valuesSubmitted: IYearTag) => {
		try {
			let values = removeEmptyKeys<IYearTag>({ objectToCheck: valuesSubmitted });
			console.log("Create Values: ", values);

			const yearTagCreated = await createYearTag({
				variables: {
					input: { data: { ...values } },
				},
				// update: async (store, { data: { createOrgDonor } }) => {
				// 	try {
				// 		const count = await store.readQuery<{ orgDonorsCount: number }>({
				// 			query: GET_DONOR_COUNT,
				// 			variables: {
				// 				filter: {
				// 					organization: dashboardData?.organization?.id,
				// 				},
				// 			},
				// 		});

				// 		store.writeQuery<{ orgDonorsCount: number }>({
				// 			query: GET_DONOR_COUNT,
				// 			variables: {
				// 				filter: {
				// 					organization: dashboardData?.organization?.id,
				// 				},
				// 			},
				// 			data: {
				// 				orgDonorsCount: count!.orgDonorsCount + 1,
				// 			},
				// 		});

				// 		let limit = 0;
				// 		if (count) {
				// 			limit = count.orgDonorsCount;
				// 		}

				// 		const data = await store.readQuery<IGET_DONOR>({
				// 			query: GET_ORG_DONOR,
				// 			variables: {
				// 				filter: {
				// 					organization: dashboardData?.organization?.id,
				// 				},
				// 				limit: limit > 10 ? 10 : limit,
				// 				start: 0,
				// 				sort: "created_at:DESC",
				// 			},
				// 		});

				// 		let orgDonors = data?.orgDonors ? data?.orgDonors : [];

				// 		store.writeQuery<IGET_DONOR>({
				// 			query: GET_ORG_DONOR,
				// 			variables: {
				// 				filter: {
				// 					organization: dashboardData?.organization?.id,
				// 				},
				// 				limit: limit > 10 ? 10 : limit,
				// 				start: 0,
				// 				sort: "created_at:DESC",
				// 			},
				// 			data: {
				// 				orgDonors: [createOrgDonor, ...orgDonors],
				// 			},
				// 		});
				// 	} catch (err) {
				// 		// console.error(err);
				// 	}
				// 	try {
				// 		const data = await store.readQuery<IGET_DONOR>({
				// 			query: GET_ORG_DONOR,
				// 			variables: {
				// 				filter: {
				// 					organization: dashboardData?.organization?.id,
				// 				},
				// 			},
				// 		});

				// 		let orgDonors = data?.orgDonors ? data?.orgDonors : [];

				// 		store.writeQuery<IGET_DONOR>({
				// 			query: GET_ORG_DONOR,
				// 			variables: {
				// 				filter: {
				// 					organization: dashboardData?.organization?.id,
				// 				},
				// 			},
				// 			data: {
				// 				orgDonors: [createOrgDonor, ...orgDonors],
				// 			},
				// 		});
				// 	} catch (err) {
				// 		// console.error(err);
				// 	}
				// },
			});
			// if (
			// 	props.formAction === FORM_ACTIONS.CREATE &&
			// 	// props.dialogType === DONOR_DIALOG_TYPE.PROJECT &&
			// 	yearTagCreated.data
			// ) {
			// 	// await createProjectDonor({
			// 	// 	variables: {
			// 	// 		input: {
			// 	// 			donor: yearTagCreated.data?.createOrgDonor?.id || "",
			// 	// 			project: props.projectId,
			// 	// 		},
			// 	// 	},
			// 	// });
			// }
			notificationDispatch(setSuccessNotification("Year Tag Creation Success"));
		} catch (err) {
			notificationDispatch(setErrorNotification(err?.message));
		} finally {
			props.handleClose();
		}
	};

	const onUpdate = async (valuesSubmitted: IYearTag) => {
		console.log("Update Values: ", valuesSubmitted);
		// try {
		// 	let values = removeEmptyKeys<IDONOR>({
		// 		objectToCheck: valuesSubmitted,
		// 		keysToRemainUnchecked: {
		// 			legal_name: 1,
		// 			short_name: 1,
		// 		},
		// 	});

		// 	if (compareObjectKeys(values, initialValues)) {
		// 		props.handleClose();
		// 		return;
		// 	}
		// 	delete (values as any).id;

		// 	await updateDonor({
		// 		variables: {
		// 			id: initialValues.id,
		// 			input: {
		// 				...values,
		// 				organization: dashboardData?.organization?.id,
		// 			},
		// 		},
		// 	});
		// 	notificationDispatch(setSuccessNotification("Donor Updation Success"));
		// } catch (err) {
		// 	notificationDispatch(setErrorNotification(err?.message));
		// } finally {
		// 	props.handleClose();
		// }
	};

	useEffect(() => {
		getCountryList();
	}, [getCountryList]);

	const intl = useIntl();

	const title = intl.formatMessage({
		id: `yearTagFormTitle`,
		defaultMessage: "Add YearTag",
		description: `This text will be show as title of year tag form`,
	});

	// const subtitle = intl.formatMessage({
	// 	id: `donorFormSubtitle`,
	// 	defaultMessage: "Physical addresses of your organizatin like headquater, branch etc.",
	// 	description: `This text will be show as subtitle of donor form`,
	// });

	const updateDonorSubtitle = intl.formatMessage({
		id: "yearTagUpdateFormSubtitle",
		defaultMessage: "Update Year Tag",
		description: `This text will be show on update year tag form`,
	});

	const createDonorSubtitle = intl.formatMessage({
		id: "yearTagCreateFormSubtitle",
		defaultMessage: "Create New Year Tag ",
		description: `This text will be show on create Year Tag form`,
	});

	const onDelete = async () => {
		console.log("Delete Called");
		// try {
		// 	const donorValues = { ...initialValues };
		// 	delete donorValues["id"];
		// 	await updateDonor({
		// 		variables: {
		// 			id: initialValues?.id,
		// 			input: {
		// 				deleted: true,
		// 				...donorValues,
		// 				organization: dashboardData?.organization?.id,
		// 			},
		// 		},
		// 		refetchQueries: [
		// 			{
		// 				query: GET_DONOR_COUNT,
		// 				variables: {
		// 					filter: { organization: dashboardData?.organization?.id },
		// 				},
		// 			},
		// 		],
		// 	});
		// 	notificationDispatch(setSuccessNotification("Donor Delete Success"));
		// } catch (err) {
		// 	notificationDispatch(setErrorNotification(err.message));
		// } finally {
		// 	props.handleClose();
		// }
	};

	if (props.deleteYearTag) {
		return (
			<DeleteModal
				open={props.open}
				handleClose={props.handleClose}
				onDeleteConformation={onDelete}
				title="Delete Year Tag"
			/>
		);
	}

	return (
		<>
			<FormDialog
				handleClose={props.handleClose}
				open={props.open}
				// loading={creatingDonor || updatingDonor || creatingProjectDonors}
				loading={false}
				title={title}
				subtitle={
					props.formAction === FORM_ACTIONS.CREATE
						? createDonorSubtitle
						: updateDonorSubtitle
				}
				workspace={""}
				project={""}
			>
				<CommonForm
					initialValues={initialValues}
					validate={validate}
					onCreate={onCreate}
					onCancel={props.handleClose}
					inputFields={addYearTagForm}
					formAction={props.formAction}
					onUpdate={onUpdate}
				/>
			</FormDialog>
		</>
	);
}

export default YearTag;
