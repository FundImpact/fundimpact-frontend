import React, { useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
	GET_ORGANIZATION_BUDGET_CATEGORY,
	CREATE_PROJECT_BUDGET_TARGET,
	UPDATE_PROJECT_BUDGET_TARGET,
} from "../../../../graphql/queries/budget";
import { GET_BUDGET_TARGET_PROJECT } from "../../../../graphql/queries/budget";
import { useDashBoardData } from "../../../../contexts/dashboardContext";
import { IGET_BUDGET_TARGET_PROJECT } from "../../../../models/budget/query";
import { ICreateBudgetTargetProjectDialogProps } from "../../../../models/budget/budget";
import { FORM_ACTIONS } from "../../../../models/budget/constants";
import { IBudgetTargetForm } from "../../../../models/budget/budgetForm";
import {
	setErrorNotification,
	setSuccessNotification,
} from "../../../../reducers/notificationReducer";
import { useNotificationDispatch } from "../../../../contexts/notificationContext";
import {
	createBudgetTargetFormSelectFields,
	createBudgetTargetForm,
} from "../../../../utils/inputFields.json";
import FormDialog from "../../../FormDialog";
import CommonForm from "../../../Forms/CommonForm";
import { GET_PROJ_DONORS } from "../../../../graphql/queries/project";
import { GET_ORG_CURRENCIES_BY_ORG } from "../../../../graphql/queries";
import { compareObjectKeys } from "../../../../utils";

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

function BudgetTargetProjectDialog(props: ICreateBudgetTargetProjectDialogProps) {
	const notificationDispatch = useNotificationDispatch();
	const dashboardData = useDashBoardData();

	const [createProjectBudgetTarget, { loading: creatingProjectBudgetTarget }] = useMutation(
		CREATE_PROJECT_BUDGET_TARGET
	);

	let initialValues =
		props.formAction == FORM_ACTIONS.CREATE ? defaultFormValues : props.initialValues;

	const [updateProjectBudgetTarget, { loading: updatingProjectBudgetTarget }] = useMutation(
		UPDATE_PROJECT_BUDGET_TARGET
	);

	const { data: orgCurrencies } = useQuery(GET_ORG_CURRENCIES_BY_ORG, {
		variables: {
			filter: {
				organization: dashboardData?.organization?.id,
				isHomeCurrency: true,
			},
		},
	});

	const { data: budgetCategory } = useQuery(GET_ORGANIZATION_BUDGET_CATEGORY, {
		variables: {
			filter: {
				organization: dashboardData?.organization?.id,
			},
		},
	});

	const { data: donors } = useQuery(GET_PROJ_DONORS, {
		variables: {
			filter: {
				project: dashboardData?.project?.id,
			},
		},
	});

	useEffect(() => {
		if (orgCurrencies) {
			createBudgetTargetForm[1].endAdornment = orgCurrencies.orgCurrencies[0].currency.code;
		}
	}, [orgCurrencies]);

	useEffect(() => {
		if (donors) {
			createBudgetTargetFormSelectFields[1].optionsArray = donors.projectDonors.map(
				({ donor }: { donor: { id: string; name: string } }) => {
					return { id: donor.id, name: donor.name };
				}
			);
		}
	}, [donors]);

	useEffect(() => {
		if (budgetCategory) {
			createBudgetTargetFormSelectFields[0].optionsArray = budgetCategory.orgBudgetCategory;
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
						const dataRead = await store.readQuery<IGET_BUDGET_TARGET_PROJECT>({
							query: GET_BUDGET_TARGET_PROJECT,
							variables: {
								filter: {
									project: dashboardData?.project?.id,
								},
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
								projectBudgetTargets: [
									...dataRead!.projectBudgetTargets,
									projectCreated,
								],
							},
						});
					} catch (err) {
						throw err;
					}
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
				inputFields={createBudgetTargetForm}
				selectFields={createBudgetTargetFormSelectFields}
				formAction={props.formAction}
				onUpdate={onUpdate}
			/>
		</FormDialog>
	);
}

export default BudgetTargetProjectDialog;
