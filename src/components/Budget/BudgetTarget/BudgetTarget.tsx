import { useLazyQuery, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";

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
import { GET_PROJ_DONORS } from "../../../graphql/project";
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
import CommonForm from "../../Forms/CommonForm";
import { budgetTargetFormInputFields, budgetTargetFormSelectFields } from "./inputFields.json";
import BudgetCategory from "../BudgetCategory";
import Donor from "../../Donor";
import { DONOR_DIALOG_TYPE } from "../../../models/donor/constants";

const defaultFormValues: IBudgetTargetForm = {
	name: "",
	total_target_amount: "",
	description: "",
	budget_category_organization: "",
	donor: "",
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

function BudgetTargetProjectDialog(props: IBudgetTargetProjectProps) {
	const notificationDispatch = useNotificationDispatch();
	const dashboardData = useDashBoardData();

	const [openBudgetCategoryDialog, setOpenBudgetCategoryDialog] = useState<boolean>(false);
	const [openDonorCreateDialog, setOpenDonorCreateDialog] = useState<boolean>(false);

	const [createProjectBudgetTarget, { loading: creatingProjectBudgetTarget }] = useMutation(
		CREATE_PROJECT_BUDGET_TARGET
	);

	let initialValues =
		props.formAction === FORM_ACTIONS.CREATE ? defaultFormValues : props.initialValues;

	const [updateProjectBudgetTarget, { loading: updatingProjectBudgetTarget }] = useMutation(
		UPDATE_PROJECT_BUDGET_TARGET
	);

	let [getCurrency, { data: currency }] = useLazyQuery(GET_CURRENCY_LIST);

	let [getBudgetCategory, { data: budgetCategory }] = useLazyQuery(
		GET_ORGANIZATION_BUDGET_CATEGORY
	);
	const intl = useIntl();
	let [getDonors, { data: donors }] = useLazyQuery(GET_PROJ_DONORS);
	let budgetTargetTitle = intl.formatMessage({
		id: "budgetTargetFormTitle",
		defaultMessage: "Budget Target",
		description: `This text will be show on Budget target form for title`,
	});
	// let "" = intl.formatMessage({
	// 	id: "budgetTargetFormSubtitle",
	// 	defaultMessage: "Physical addresses of your organisation like headquarter branch etc",
	// 	description: `This text will be show on Budget target form for subtitle`,
	// });
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
			getDonors({
				variables: {
					filter: {
						project: dashboardData?.project?.id,
					},
				},
			});
		}
	}, [getDonors, dashboardData]);

	if (currency?.currencyList?.length) {
		budgetTargetFormInputFields[1].endAdornment = currency.currencyList[0].code;
	}

	useEffect(() => {
		if (donors) {
			budgetTargetFormSelectFields[1].optionsArray = donors.projectDonors
				.filter(({ donor }: { donor: { id: string; name: string } }) => donor)
				.map(({ donor }: { donor: { id: string; name: string } }) => {
					return { id: donor.id, name: donor.name };
				});
		}
	}, [donors]);

	useEffect(() => {
		if (budgetCategory) {
			budgetTargetFormSelectFields[0].optionsArray = budgetCategory.orgBudgetCategory;
		}
	}, [budgetCategory]);

	const onCreate = async (valuesSubmitted: IBudgetTargetForm) => {
		try {
			let values = removeEmptyKeys<IBudgetTargetForm>({ objectToCheck: valuesSubmitted });
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
			});
			notificationDispatch(setSuccessNotification("Budget Target Creation Success"));
			props.handleClose();
		} catch (err) {
			notificationDispatch(setErrorNotification("Budget Target Creation Failure"));
			props.handleClose();
		}
	};

	const onUpdate = async (valuesSubmitted: IBudgetTargetForm) => {
		try {
			let values = removeEmptyKeys<IBudgetTargetForm>({
				objectToCheck: valuesSubmitted,
				keysToRemainUnchecked: {
					description: 1,
				},
			});
			if (compareObjectKeys(values, initialValues)) {
				props.handleClose();
				return;
			}

			delete (values as any).id;

			await updateProjectBudgetTarget({
				variables: {
					id: initialValues.id,
					input: {
						project: dashboardData?.project?.id,
						...values,
					},
				},
			});
			notificationDispatch(setSuccessNotification("Budget Target Updation Success"));

			props.handleClose();
		} catch (err) {
			notificationDispatch(setErrorNotification("Budget Target Updation Failure"));
			props.handleClose();
		}
	};

	budgetTargetFormSelectFields[0].addNewClick = () => setOpenBudgetCategoryDialog(true);
	budgetTargetFormSelectFields[1].addNewClick = () => setOpenDonorCreateDialog(true);
	let { newOrEdit } = CommonFormTitleFormattedMessage(props.formAction);
	return (
		<>
			<BudgetCategory
				open={openBudgetCategoryDialog}
				formAction={FORM_ACTIONS.CREATE}
				handleClose={() => setOpenBudgetCategoryDialog(false)}
			/>
			<Donor
				open={openDonorCreateDialog}
				formAction={FORM_ACTIONS.CREATE}
				handleClose={() => setOpenDonorCreateDialog(false)}
				dialogType={DONOR_DIALOG_TYPE.PROJECT}
				projectId={`${dashboardData?.project?.id}`}
			/>
			<FormDialog
				handleClose={props.handleClose}
				open={props.open}
				loading={creatingProjectBudgetTarget || updatingProjectBudgetTarget}
				title={newOrEdit + " " + budgetTargetTitle}
				subtitle={""}
				workspace={dashboardData?.workspace?.name}
				project={dashboardData?.project?.name ? dashboardData?.project?.name : ""}
			>
				<CommonForm
					initialValues={initialValues}
					validate={validate}
					onSubmit={onCreate}
					onCancel={props.handleClose}
					inputFields={budgetTargetFormInputFields}
					selectFields={budgetTargetFormSelectFields}
					formAction={props.formAction}
					onUpdate={onUpdate}
				/>
			</FormDialog>
		</>
	);
}

export default BudgetTargetProjectDialog;
