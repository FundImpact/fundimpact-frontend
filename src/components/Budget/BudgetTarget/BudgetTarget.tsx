import { useLazyQuery, useMutation, ApolloClient, useApolloClient } from "@apollo/client";
import React, { useCallback, useEffect, useState } from "react";
import { useIntl, FormattedMessage } from "react-intl";

import { useDashBoardData } from "../../../contexts/dashboardContext";
import { useNotificationDispatch } from "../../../contexts/notificationContext";
import { GET_CURRENCY_LIST } from "../../../graphql";
import {
	GET_BUDGET_TARGET_PROJECT,
	GET_ORGANIZATION_BUDGET_CATEGORY,
	GET_PROJECT_BUDGET_TARGETS_COUNT,
} from "../../../graphql/Budget";
import {
	CREATE_PROJECT_BUDGET_TARGET,
	UPDATE_PROJECT_BUDGET_TARGET,
} from "../../../graphql/Budget/mutation";
import { GET_PROJECT_BUDGET_AMOUNT, GET_PROJ_DONORS } from "../../../graphql/project";
import { IBudgetCategory, IBudgetTargetProjectProps } from "../../../models/budget";
import { IBudgetTargetForm } from "../../../models/budget/budgetForm";
import { FORM_ACTIONS } from "../../../models/budget/constants";
import {
	IBudgetTargetProjectResponse,
	IGET_BUDGET_TARGET_PROJECT,
} from "../../../models/budget/query";
import {
	setErrorNotification,
	setSuccessNotification,
} from "../../../reducers/notificationReducer";
import { compareObjectKeys, removeEmptyKeys, validateEmail } from "../../../utils";
import { CommonFormTitleFormattedMessage } from "../../../utils/commonFormattedMessage";
import FormDialog from "../../FormDialog";
import CommonForm from "../../CommonForm";
import { budgetTargetFormInputFields } from "./inputFields.json";
import BudgetCategory from "../BudgetCategory";
import Donor from "../../Donor";
import { DONOR_DIALOG_TYPE } from "../../../models/donor/constants";
import { GET_ORG_DONOR } from "../../../graphql/donor";
import {
	IGetProjectDonor,
	ICreateProjectDonor,
	ICreateProjectDonorVariables,
} from "../../../models/project/project";
import { IGET_DONOR } from "../../../models/donor/query";
import { CREATE_PROJECT_DONOR } from "../../../graphql/donor/mutation";

enum donorType {
	project = "PROJECT'S DONOR",
	organization = "ALL DONORS",
}

interface IBudgetTargetSubmittedValues extends Omit<IBudgetTargetForm, "donor"> {
	donor: { id: string; name: string; type: donorType };
}

const getDonors = ({
	orgDonors,
	projectDonors,
}: {
	orgDonors: IGET_DONOR["orgDonors"];
	projectDonors: IGetProjectDonor["projectDonors"];
}) => {
	let projectDonorIdHash = projectDonors.reduce((acc: { [key: string]: boolean }, projDonor) => {
		acc[projDonor.donor.id] = true;
		return acc;
	}, {});
	let donorArr = [];
	projectDonors.length &&
		donorArr.push(
			{
				groupName: (
					<FormattedMessage
						defaultMessage="PROJECT'S DONOR"
						id="selectInputProjectDonor"
						description="This text will be heading of project donor"
					/>
				),
			},
			...projectDonors
				.filter((donor) => donor)
				.map((projDonor) => ({
					name: projDonor?.donor?.name,
					id: projDonor?.donor?.id,
				}))
		);

	let filteredOrgDonor = orgDonors
		.filter((donor) => !projectDonorIdHash[donor.id])
		.map((donor) => ({ id: donor?.id, name: donor?.name }));

	filteredOrgDonor.length &&
		donorArr.push(
			{
				groupName: (
					<FormattedMessage
						id="selectInputAllDonor"
						defaultMessage="ALL DONORS"
						description="This text will be heading of all donor"
					/>
				),
			},
			...filteredOrgDonor
		);

	return donorArr;
};

const checkDonorType = ({
	projectDonors,
	donorId,
}: {
	projectDonors: IGetProjectDonor["projectDonors"];
	donorId: string;
}) => {
	for (let i = 0; i < projectDonors.length; i++) {
		if (projectDonors[i].donor.id === donorId) {
			return donorType.project;
		}
	}
	return donorType.organization;
};

const updateProjectDonorCache = ({
	projecttDonorCreated,
	apolloClient,
}: {
	apolloClient: ApolloClient<object>;
	projecttDonorCreated: ICreateProjectDonor;
}) => {
	try {
		let cachedProjectDonors = apolloClient.readQuery<IGetProjectDonor>({
			variables: { filter: { project: projecttDonorCreated.createProjDonor.project.id } },
			query: GET_PROJ_DONORS,
		});
		if (cachedProjectDonors) {
			apolloClient.writeQuery<IGetProjectDonor>({
				query: GET_PROJ_DONORS,
				data: {
					projectDonors: [
						projecttDonorCreated.createProjDonor,
						...cachedProjectDonors.projectDonors,
					],
				},
				variables: { filter: { project: projecttDonorCreated.createProjDonor.project.id } },
			});
		}
	} catch (err) {
		console.error(err);
	}
};

const validate = (values: IBudgetTargetForm) => {
	let errors: Partial<IBudgetTargetForm> = {};

	if (!values.name) {
		errors.name = "Name is required";
	}
	if (!values.total_target_amount) {
		errors.total_target_amount = "Total target amount is required";
	}
	if (!values.budget_category_organization) {
		errors.budget_category_organization = "Budget Category is required";
	}
	if (!values.donor) {
		errors.donor = "Donor is required";
	}

	return errors;
};

const getInitialValues = ({
	props,
	projectDonors,
	createdBudgetCategory,
}: {
	props: IBudgetTargetProjectProps;
	projectDonors: IGetProjectDonor["projectDonors"];
	createdBudgetCategory?: IBudgetCategory | null;
}) => {
	if (props.formAction === FORM_ACTIONS.CREATE) {
		return {
			name: "",
			total_target_amount: "",
			description: "",
			budget_category_organization: createdBudgetCategory ? createdBudgetCategory.id : "",
			donor: projectDonors.length === 1 ? projectDonors[0].donor.id : "",
		};
	}
	return props.initialValues;
};

function BudgetTargetProjectDialog(props: IBudgetTargetProjectProps) {
	const notificationDispatch = useNotificationDispatch();
	const dashboardData = useDashBoardData();
	const apolloClient = useApolloClient();
	const { handleClose } = props;
	const [createdBudgetCategory, setCreatedBudgetCategory] = useState<IBudgetCategory | null>();

	const closeBudgetTargetProjectDialog = useCallback(() => {
		handleClose();
		setCreatedBudgetCategory(null);
	}, [handleClose, setCreatedBudgetCategory]);

	const [openBudgetCategoryDialog, setOpenBudgetCategoryDialog] = useState<boolean>(false);
	const [openDonorCreateDialog, setOpenDonorCreateDialog] = useState<boolean>(false);

	const [createProjectBudgetTarget, { loading: creatingProjectBudgetTarget }] = useMutation(
		CREATE_PROJECT_BUDGET_TARGET
	);

	let [getProjectDonors, { data: projectDonors }] = useLazyQuery<IGetProjectDonor>(
		GET_PROJ_DONORS
	);

	let initialValues = getInitialValues({
		props,
		projectDonors: projectDonors?.projectDonors || [],
		createdBudgetCategory: createdBudgetCategory,
	});

	const [updateProjectBudgetTarget, { loading: updatingProjectBudgetTarget }] = useMutation(
		UPDATE_PROJECT_BUDGET_TARGET
	);

	let [getCurrency, { data: currency }] = useLazyQuery(GET_CURRENCY_LIST);

	let [getBudgetCategory, { data: budgetCategory }] = useLazyQuery(
		GET_ORGANIZATION_BUDGET_CATEGORY
	);

	const [createProjectDonor, { loading: creatingProjectDonors }] = useMutation<
		ICreateProjectDonor,
		ICreateProjectDonorVariables
	>(CREATE_PROJECT_DONOR, {
		onCompleted: (data) => {
			updateProjectDonorCache({ apolloClient, projecttDonorCreated: data });
		},
	});

	const intl = useIntl();

	let [getOrganizationDonors, { data: orgDonors }] = useLazyQuery<IGET_DONOR>(GET_ORG_DONOR);
	let budgetTargetTitle = intl.formatMessage({
		id: "budgetTargetFormTitle",
		defaultMessage: "Budget Target",
		description: `This text will be show on Budget target form for title`,
	});

	let createBudgetTargetSubtitle = intl.formatMessage({
		id: "createBudgetTargetFormSubtitle",
		defaultMessage: "Create Budget Target For Project",
		description: `This text will be show on create Budget target form for subtitle`,
	});

	let updateBudgetTargetSubtitle = intl.formatMessage({
		id: "updateBudgetTargetFormSubtitle",
		defaultMessage: "Update Budget Target Of Project",
		description: `This text will be show on update Budget target form for subtitle`,
	});
	useEffect(() => {
		if (dashboardData) {
			getCurrency({
				variables: {
					filter: {
						country: dashboardData?.organization?.country?.id,
					},
				},
			});
		}
	}, [getCurrency, dashboardData]);

	useEffect(() => {
		getOrganizationDonors({
			variables: {
				filter: {
					organization: dashboardData?.organization?.id,
				},
			},
		});
	}, [getOrganizationDonors]);

	useEffect(() => {
		if (dashboardData?.organization) {
			getBudgetCategory({
				variables: {
					filter: {
						organization: dashboardData?.organization?.id,
					},
				},
			});
		}
	}, [getBudgetCategory, dashboardData]);

	useEffect(() => {
		if (dashboardData?.project) {
			getProjectDonors({
				variables: {
					filter: {
						project: dashboardData?.project?.id,
					},
				},
			});
		}
	}, [getProjectDonors, dashboardData]);

	if (currency?.currencyList?.length) {
		budgetTargetFormInputFields[1].endAdornment = currency.currencyList[0].code;
	}

	(budgetTargetFormInputFields[4].optionsArray as any) = getDonors({
		projectDonors: projectDonors?.projectDonors || [],
		orgDonors: orgDonors?.orgDonors || [],
	});

	// (budgetTargetFormInputFields[4]
	// 	.autoCompleteGroupBy as unknown) = getDonorGroupHeadingInBudgetTargetForm;

	useEffect(() => {
		if (budgetCategory) {
			budgetTargetFormInputFields[3].optionsArray = budgetCategory.orgBudgetCategory;
		}
	}, [budgetCategory]);

	const onCreate = async (valuesSubmitted: IBudgetTargetForm) => {
		try {
			let donorTypeSelected = checkDonorType({
				projectDonors: projectDonors?.projectDonors || [],
				donorId: valuesSubmitted.donor,
			});
			if (donorTypeSelected === donorType.organization) {
				let createdProjectDonor = await createProjectDonor({
					variables: {
						input: {
							donor: valuesSubmitted.donor,
							project: `${dashboardData?.project?.id}` || "",
						},
					},
				});
			}

			let values = removeEmptyKeys<IBudgetTargetForm>({
				objectToCheck: { ...valuesSubmitted },
			});
			await createProjectBudgetTarget({
				variables: {
					input: {
						project: dashboardData?.project?.id,
						...values,
					},
				},
				update: async (store, { data: { createProjectBudgetTarget: projectCreated } }) => {
					try {
						const count = await store.readQuery<{ projectBudgetTargetsCount: number }>({
							query: GET_PROJECT_BUDGET_TARGETS_COUNT,
							variables: {
								filter: {
									project: dashboardData?.project?.id,
								},
							},
						});

						store.writeQuery<{ projectBudgetTargetsCount: number }>({
							query: GET_PROJECT_BUDGET_TARGETS_COUNT,
							variables: {
								filter: {
									project: dashboardData?.project?.id,
								},
							},
							data: {
								projectBudgetTargetsCount: count!.projectBudgetTargetsCount + 1,
							},
						});

						let limit = 0;
						if (count) {
							limit = count.projectBudgetTargetsCount;
						}
						const dataRead = await store.readQuery<IGET_BUDGET_TARGET_PROJECT>({
							query: GET_BUDGET_TARGET_PROJECT,
							variables: {
								filter: {
									project: dashboardData?.project?.id,
								},
								limit: limit > 10 ? 10 : limit,
								start: 0,
								sort: "created_at:DESC",
							},
						});
						let budgetTargets: IBudgetTargetProjectResponse[] = dataRead?.projectBudgetTargets
							? dataRead?.projectBudgetTargets
							: [];

						store.writeQuery<IGET_BUDGET_TARGET_PROJECT>({
							query: GET_BUDGET_TARGET_PROJECT,
							variables: {
								filter: {
									project: dashboardData?.project?.id,
								},
								limit: limit > 10 ? 10 : limit,
								start: 0,
								sort: "created_at:DESC",
							},
							data: {
								projectBudgetTargets: [...budgetTargets, projectCreated],
							},
						});

						store.writeQuery<IGET_BUDGET_TARGET_PROJECT>({
							query: GET_BUDGET_TARGET_PROJECT,
							variables: {
								filter: {
									project: dashboardData?.project?.id,
								},
							},
							data: {
								projectBudgetTargets: [...budgetTargets, projectCreated],
							},
						});
					} catch (err) {}
				},
				refetchQueries: [
					{
						query: GET_PROJECT_BUDGET_AMOUNT,
						variables: { filter: { project: dashboardData?.project?.id } },
					},
				],
			});
			notificationDispatch(setSuccessNotification("Budget Target Creation Success"));
			closeBudgetTargetProjectDialog();
		} catch (err) {
			notificationDispatch(setErrorNotification("Budget Target Creation Failure"));
			closeBudgetTargetProjectDialog();
		}
	};

	const onUpdate = async (valuesSubmitted: IBudgetTargetForm) => {
		try {
			let donorSelected = checkDonorType({
				projectDonors: projectDonors?.projectDonors || [],
				donorId: valuesSubmitted.donor,
			});
			if (donorSelected === donorType.organization) {
				let createdProjectDonor = await createProjectDonor({
					variables: {
						input: {
							donor: valuesSubmitted.donor,
							project: `${dashboardData?.project?.id}` || "",
						},
					},
				});
			}

			let values = removeEmptyKeys<IBudgetTargetForm>({
				objectToCheck: { ...valuesSubmitted },
				keysToRemainUnchecked: {
					description: 1,
				},
			});
			if (compareObjectKeys(values, initialValues)) {
				closeBudgetTargetProjectDialog();
				return;
			}

			delete (values as any).id;

			props.formAction === FORM_ACTIONS.UPDATE &&
				(await updateProjectBudgetTarget({
					variables: {
						id: props.initialValues.id,
						input: {
							project: dashboardData?.project?.id,
							...values,
						},
					},
					refetchQueries: [
						{
							query: GET_PROJECT_BUDGET_AMOUNT,
							variables: { filter: { project: dashboardData?.project?.id } },
						},
					],
				}));
			notificationDispatch(setSuccessNotification("Budget Target Updation Success"));

			closeBudgetTargetProjectDialog();
		} catch (err) {
			notificationDispatch(setErrorNotification("Budget Target Updation Failure"));
			closeBudgetTargetProjectDialog();
		}
	};

	budgetTargetFormInputFields[3].addNewClick = () => setOpenBudgetCategoryDialog(true);
	budgetTargetFormInputFields[4].addNewClick = () => setOpenDonorCreateDialog(true);
	let { newOrEdit } = CommonFormTitleFormattedMessage(props.formAction);

	return (
		<>
			<BudgetCategory
				open={openBudgetCategoryDialog}
				formAction={FORM_ACTIONS.CREATE}
				handleClose={() => setOpenBudgetCategoryDialog(false)}
				getCreatedBudgetCategory={(budgetCategoryCreated) => {
					setCreatedBudgetCategory(budgetCategoryCreated);
				}}
			/>
			<Donor
				open={openDonorCreateDialog}
				formAction={FORM_ACTIONS.CREATE}
				handleClose={() => setOpenDonorCreateDialog(false)}
				dialogType={DONOR_DIALOG_TYPE.PROJECT}
				projectId={`${dashboardData?.project?.id}`}
			/>
			<FormDialog
				handleClose={closeBudgetTargetProjectDialog}
				open={props.open}
				loading={
					creatingProjectBudgetTarget ||
					updatingProjectBudgetTarget ||
					creatingProjectDonors
				}
				title={newOrEdit + " " + budgetTargetTitle}
				subtitle={
					props.formAction === FORM_ACTIONS.CREATE
						? createBudgetTargetSubtitle
						: updateBudgetTargetSubtitle
				}
				workspace={dashboardData?.project?.workspace?.name || ""}
				project={dashboardData?.project?.name ? dashboardData?.project?.name : ""}
			>
				<CommonForm
					initialValues={initialValues}
					validate={validate}
					onCreate={onCreate}
					onCancel={closeBudgetTargetProjectDialog}
					inputFields={budgetTargetFormInputFields}
					formAction={props.formAction}
					onUpdate={onUpdate}
				/>
			</FormDialog>
		</>
	);
}

export default BudgetTargetProjectDialog;
