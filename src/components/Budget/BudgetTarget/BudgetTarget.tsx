import { useLazyQuery, useMutation, ApolloClient, useApolloClient } from "@apollo/client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useIntl, FormattedMessage } from "react-intl";

import { useDashBoardData } from "../../../contexts/dashboardContext";
import { useNotificationDispatch } from "../../../contexts/notificationContext";
import { GET_CURRENCY_LIST } from "../../../graphql";
import {
	GET_BUDGET_CATEGORY_PROJECT_COUNT,
	GET_BUDGET_TARGET_PROJECT,
	GET_ORGANIZATION_BUDGET_CATEGORY,
	GET_PROJECT_BUDGET_TARGETS_COUNT,
} from "../../../graphql/Budget";
import {
	CREATE_PROJECT_BUDGET_TARGET,
	UPDATE_PROJECT_BUDGET_TARGET,
} from "../../../graphql/Budget/mutation";
import {
	GET_PROJECT_AMOUNT_SPEND,
	GET_PROJECT_BUDGET_AMOUNT,
	GET_PROJ_DONORS,
} from "../../../graphql/project";
import { IBudgetTargetProjectProps } from "../../../models/budget";
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
import { compareObjectKeys, removeEmptyKeys } from "../../../utils";
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
import { FormikProps } from "formik";
import DeleteModal from "../../DeleteModal";
import { DIALOG_TYPE } from "../../../models/constants";
import { useProjectDonorSelectInput } from "../../../hooks/project";
import { Checkbox, FormControlLabel } from "@material-ui/core";

enum donorType {
	project = "PROJECT'S DONOR",
	organization = "ALL DONORS",
}

interface IBudgetTargetSubmittedValues extends Omit<IBudgetTargetForm, "donor"> {
	donor: { id: string; name: string; type: donorType };
}

// const getDonors = ({
// 	orgDonors,
// 	projectDonors,
// }: {
// 	orgDonors: IGET_DONOR["orgDonors"];
// 	projectDonors: IGetProjectDonor["projectDonors"];
// }) => {
// 	let projectDonorIdHash = projectDonors.reduce((acc: { [key: string]: boolean }, projDonor) => {
// 		acc[projDonor.donor.id] = true;
// 		return acc;
// 	}, {});
// 	let donorArr = [];
// 	projectDonors.length &&
// 		donorArr.push(
// 			{
// 				groupName: (
// 					<FormattedMessage
// 						defaultMessage="PROJECT'S DONOR"
// 						id="selectInputProjectDonor"
// 						description="This text will be heading of project donor"
// 					/>
// 				),
// 			},
// 			...projectDonors
// 				.filter((donor) => donor)
// 				.map((projDonor) => ({
// 					name: projDonor?.donor?.name,
// 					id: projDonor?.donor?.id,
// 				}))
// 		);

// 	let filteredOrgDonor = orgDonors
// 		.filter((donor) => !projectDonorIdHash[donor.id])
// 		.map((donor) => ({ id: donor?.id, name: donor?.name }));

// 	filteredOrgDonor.length &&
// 		donorArr.push(
// 			{
// 				groupName: (
// 					<FormattedMessage
// 						id="selectInputAllDonor"
// 						defaultMessage="ALL DONORS"
// 						description="This text will be heading of all donor"
// 					/>
// 				),
// 			},
// 			...filteredOrgDonor
// 		);

// 	return donorArr;
// };

// const updateProjectDonorCache = ({
// 	projecttDonorCreated,
// 	apolloClient,
// }: {
// 	apolloClient: ApolloClient<object>;
// 	projecttDonorCreated: ICreateProjectDonor;
// }) => {
// 	try {
// 		let cachedProjectDonors = apolloClient.readQuery<IGetProjectDonor>({
// 			variables: { filter: { project: projecttDonorCreated.createProjDonor.project.id } },
// 			query: GET_PROJ_DONORS,
// 		});
// 		if (cachedProjectDonors) {
// 			apolloClient.writeQuery<IGetProjectDonor>({
// 				query: GET_PROJ_DONORS,
// 				data: {
// 					projectDonors: [
// 						{ ...projecttDonorCreated?.createProjDonor, deleted: false },
// 						...cachedProjectDonors.projectDonors,
// 					],
// 				},
// 				variables: { filter: { project: projecttDonorCreated.createProjDonor.project.id } },
// 			});
// 		}
// 	} catch (err) {
// 		console.error(err);
// 	}
// };

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
}: {
	props: IBudgetTargetProjectProps;
	projectDonors: IGetProjectDonor["projectDonors"];
}) => {
	if (props.formAction === FORM_ACTIONS.CREATE) {
		return {
			name: "",
			total_target_amount: "",
			description: "",
			budget_category_organization: "",
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
	const budgetTargetFormFormikInstance = useRef<FormikProps<any>>();

	const closeBudgetTargetProjectDialog = useCallback(() => {
		handleClose();
		budgetTargetFormFormikInstance.current = undefined;
	}, [handleClose]);

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
	});

	const [updateProjectBudgetTarget, { loading: updatingProjectBudgetTarget }] = useMutation(
		UPDATE_PROJECT_BUDGET_TARGET
	);

	let [getCurrency, { data: currency }] = useLazyQuery(GET_CURRENCY_LIST);

	let [getBudgetCategory, { data: budgetCategory }] = useLazyQuery(
		GET_ORGANIZATION_BUDGET_CATEGORY
	);

	const intl = useIntl();

	// let [getOrganizationDonors, { data: orgDonors }] = useLazyQuery<IGET_DONOR>(GET_ORG_DONOR);
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

	const {
		createProjectDonor,
		selectedDonorInputOptionArray,
		setSelectedDonor,
		showCreateProjectDonorCheckbox,
		creatingProjectDonors,
		setCreateProjectDonorCheckboxVal,
	} = useProjectDonorSelectInput({
		formAction: props.formAction,
		initialDonorId: initialValues.donor,
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

	// useEffect(() => {
	// 	if (dashboardData?.organization?.id) {
	// 		getOrganizationDonors({
	// 			variables: {
	// 				filter: {
	// 					organization: dashboardData?.organization?.id,
	// 				},
	// 			},
	// 		});
	// 	}
	// }, [getOrganizationDonors]);

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

	(budgetTargetFormInputFields[4].optionsArray as any) = selectedDonorInputOptionArray;
	budgetTargetFormInputFields[4].getInputValue = (donorId: string) => {
		setSelectedDonor(donorId);
	};
	(budgetTargetFormInputFields[4].helperText as any) = showCreateProjectDonorCheckbox && (
		<FormControlLabel
			control={
				<Checkbox
					onChange={(e) => {
						e.persist();
						setCreateProjectDonorCheckboxVal(e?.target?.checked);
					}}
					size="small"
					inputProps={{ "aria-label": "make selected donor project donor" }}
				/>
			}
			label="Make org donor project donor"
		/>
	);

	useEffect(() => {
		if (budgetCategory) {
			budgetTargetFormInputFields[3].optionsArray = budgetCategory.orgBudgetCategory;
		}
	}, [budgetCategory]);

	const onCreate = async (valuesSubmitted: IBudgetTargetForm) => {
		try {
			// if (donorTypeSelected === donorType.organization) {
			// 	let createdProjectDonor = await createProjectDonor({
			// 		variables: {
			// 			input: {
			// 				donor: valuesSubmitted.donor,
			// 				project: `${dashboardData?.project?.id}` || "",
			// 			},
			// 		},
			// 	});
			// }
			await createProjectDonor();

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
			notificationDispatch(setErrorNotification(err?.message));
			closeBudgetTargetProjectDialog();
		}
	};

	const onUpdate = async (valuesSubmitted: IBudgetTargetForm) => {
		try {
			// let donorSelected = checkDonorType({
			// 	projectDonors: projectDonors?.projectDonors || [],
			// 	donorId: valuesSubmitted.donor,
			// });
			// if (donorSelected === donorType.organization) {
			// 	let createdProjectDonor = await createProjectDonor({
			// 		variables: {
			// 			input: {
			// 				donor: valuesSubmitted.donor,
			// 				project: `${dashboardData?.project?.id}` || "",
			// 			},
			// 		},
			// 	});
			// }
			await createProjectDonor();
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
			notificationDispatch(setErrorNotification(err?.message));
			closeBudgetTargetProjectDialog();
		}
	};

	const onDelete = async () => {
		try {
			const budgetTargetValues = { ...initialValues };
			delete budgetTargetValues["id"];
			await updateProjectBudgetTarget({
				variables: {
					id: initialValues?.id,
					input: {
						deleted: true,
						project: dashboardData?.project?.id,
						...budgetTargetValues,
					},
				},
				refetchQueries: [
					{
						query: GET_PROJECT_BUDGET_AMOUNT,
						variables: { filter: { project: dashboardData?.project?.id } },
					},
					{
						query: GET_PROJECT_AMOUNT_SPEND,
						variables: { filter: { project: dashboardData?.project?.id } },
					},
					{
						query: GET_PROJECT_BUDGET_TARGETS_COUNT,
						variables: { filter: { project: dashboardData?.project?.id } },
					},
					{
						query: GET_BUDGET_CATEGORY_PROJECT_COUNT,
						variables: {
							filter: {
								budget_category_organization:
									budgetTargetValues?.budget_category_organization,
							},
						},
					},
				],
			});
			notificationDispatch(setSuccessNotification("Budget Target Delete Success"));
		} catch (err) {
			notificationDispatch(setErrorNotification(err.message));
		} finally {
			handleClose();
		}
	};

	budgetTargetFormInputFields[3].addNewClick = () => setOpenBudgetCategoryDialog(true);
	budgetTargetFormInputFields[4].addNewClick = () => setOpenDonorCreateDialog(true);
	let { newOrEdit } = CommonFormTitleFormattedMessage(props.formAction);

	if (props.dialogType === DIALOG_TYPE.DELETE) {
		return (
			<DeleteModal
				open={props.open}
				handleClose={props.handleClose}
				onDeleteConformation={onDelete}
				title="Delete Budget Target"
			/>
		);
	}

	return (
		<>
			<BudgetCategory
				open={openBudgetCategoryDialog}
				formAction={FORM_ACTIONS.CREATE}
				handleClose={() => setOpenBudgetCategoryDialog(false)}
				getCreatedBudgetCategory={(budgetCategoryCreated) => {
					budgetTargetFormFormikInstance.current?.setFieldValue(
						"budget_category_organization",
						budgetCategoryCreated.id
					);
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
					getFormikInstance={(formik: FormikProps<any>) =>
						(budgetTargetFormFormikInstance.current = formik)
					}
				/>
			</FormDialog>
		</>
	);
}

export default BudgetTargetProjectDialog;
