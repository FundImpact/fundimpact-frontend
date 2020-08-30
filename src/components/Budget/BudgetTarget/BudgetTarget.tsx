import { useMutation, useQuery } from "@apollo/client";
import React, { useEffect } from "react";

import { useDashBoardData } from "../../../contexts/dashboardContext";
import { useNotificationDispatch } from "../../../contexts/notificationContext";
import { GET_ORG_CURRENCIES_BY_ORG } from "../../../graphql";
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
import { compareObjectKeys } from "../../../utils";
import { budgetTargetFormSelectFields, budgetTargetFormInputFields } from "./inputFields.json";
import FormDialog from "../../FormDialog";
import CommonForm from "../../Forms/CommonForm";
import useLazyQueryCustom from "../../../hooks/useLazyQueryCustom";

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
	if (!values.description) {
		errors.description = "Description is required";
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

	const [createProjectBudgetTarget, { loading: creatingProjectBudgetTarget }] = useMutation(
		CREATE_PROJECT_BUDGET_TARGET
	);

	let initialValues =
		props.formAction === FORM_ACTIONS.CREATE ? defaultFormValues : props.initialValues;

	const [updateProjectBudgetTarget, { loading: updatingProjectBudgetTarget }] = useMutation(
		UPDATE_PROJECT_BUDGET_TARGET
	);

	let { fetchData: getOrgCurrencies, data: orgCurrencies } = useLazyQueryCustom({
		query: GET_ORG_CURRENCIES_BY_ORG,
	});

	let { fetchData: getBudgetCategory, data: budgetCategory } = useLazyQueryCustom({
		query: GET_ORGANIZATION_BUDGET_CATEGORY,
	});

	let { fetchData: getDonors, data: donors } = useLazyQueryCustom({
		query: GET_PROJ_DONORS,
	});

	useEffect(() => {
		if (dashboardData?.organization) {
			getOrgCurrencies({
				filter: {
					organization: dashboardData?.organization?.id,
					isHomeCurrency: true,
				},
			});
		}
	}, [getOrgCurrencies, dashboardData?.organization]);

	useEffect(() => {
		if (dashboardData?.organization) {
			getBudgetCategory({
				filter: {
					organization: dashboardData?.organization?.id,
				},
			});
		}
	}, [getBudgetCategory, dashboardData?.organization]);

	useEffect(() => {
		if (dashboardData?.project) {
			getDonors({
				filter: {
					project: dashboardData?.project?.id,
				},
			});
		}
	}, [getDonors, dashboardData?.project]);

	useEffect(() => {
		if (orgCurrencies?.orgCurrencies?.length) {
			budgetTargetFormInputFields[1].endAdornment =
				orgCurrencies.orgCurrencies[0].currency.code;
		}
	}, [orgCurrencies]);

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

	const onCreate = async (values: IBudgetTargetForm) => {
		try {
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

	const onUpdate = async (values: IBudgetTargetForm) => {
		try {
			if (compareObjectKeys(values, initialValues)) {
				props.handleClose();
				return;
			}

			delete values.id;

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

	return (
		<FormDialog
			handleClose={props.handleClose}
			open={props.open}
			loading={creatingProjectBudgetTarget || updatingProjectBudgetTarget}
			title="New Budget Target"
			subtitle="Physical addresses of your organizatin like headquater, branch etc."
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
	);
}

export default BudgetTargetProjectDialog;
