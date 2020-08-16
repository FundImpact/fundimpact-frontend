import React, { useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import { Grid, CircularProgress } from "@material-ui/core";
import {
	GET_ORGANIZATION_BUDGET_CATEGORY,
	CREATE_PROJECT_BUDGET_TARGET,
	UPDATE_PROJECT_BUDGET_TARGET,
} from "../../../graphql/queries/budget";
import { GET_ORG_CURRENCIES } from "../../../graphql/queries";
import { GET_BUDGET_TARGET_PROJECT } from "../../../graphql/queries/budget";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { IGET_BUDGET_TARGET_PROJECT } from "../../../models/budget/query";
import { ICreateBudgetTargetProjectDialogProps } from "../../../models/budget/budget";
import { BUDGET_ACTIONS } from "../../../models/budget/constants";
import { IBudgetTargetForm } from "../../../models/budget/budgetForm";
import {
	setErrorNotification,
	setSuccessNotification,
} from "../../../reducers/notificationReducer";
import { useNotificationDispatch } from "../../../contexts/notificationContext";
import CommonInputForm from "../../Forms/CommonInputForm";
import {
	createBudgetTargetFormSelectFields,
	createBudgetTargetForm,
} from "../../../utils/inputFields.json";
import DialogBoxSidebar from "../../DialogBoxSidebar";

const defaultFormValues: IBudgetTargetForm = {
	name: "",
	total_target_amount: "",
	description: "",
	conversion_factor: "",
	organization_currency: "",
	budget_category_organization: "",
};

const compObject = (obj1: any, obj2: any): boolean =>
	Object.keys(obj1).length == Object.keys(obj2).length &&
	Object.keys(obj1).every((key) => obj2.hasOwnProperty(key) && obj2[key] == obj1[key]);

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
	if (!values.conversion_factor) {
		errors.conversion_factor = "Conversion factor is required";
	}
	if (!values.budget_category_organization) {
		errors.budget_category_organization = "Budget Category is required";
	}
	if (!values.organization_currency) {
		errors.organization_currency = "Organization Currency is required";
	}
	return errors;
};

function CreateBudgetTargetProjectDialog(props: ICreateBudgetTargetProjectDialogProps) {
	const notificationDispatch = useNotificationDispatch();
	const [createProjectBudgetTarget, { loading: creatingProjectBudgetTarget }] = useMutation(
		CREATE_PROJECT_BUDGET_TARGET
	);

	let initialValues =
		props.formAction == BUDGET_ACTIONS.CREATE ? defaultFormValues : props.initialValues;

	const [updateProjectBudgetTarget, { loading: updatingProjectBudgetTarget }] = useMutation(
		UPDATE_PROJECT_BUDGET_TARGET
	);

	const { data: orgCurrencies } = useQuery(GET_ORG_CURRENCIES);
	const { data: budgetCategory } = useQuery(GET_ORGANIZATION_BUDGET_CATEGORY);
	const dashboardData = useDashBoardData();

	useEffect(() => {
		if (orgCurrencies) {
			createBudgetTargetFormSelectFields[0].optionsArray = orgCurrencies.orgCurrencies.map(
				(element: { id: string; currency: { name: string } }) => {
					return {
						name: element.currency.name,
						id: element.id,
					};
				}
			);
		}
		if (budgetCategory) {
			createBudgetTargetFormSelectFields[1].optionsArray = budgetCategory.orgBudgetCategory;
		}
	}, [orgCurrencies, budgetCategory]);

	const onCreate = async (values: IBudgetTargetForm) => {
		try {
			await createProjectBudgetTarget({
				variables: {
					input: {
						project: dashboardData?.project?.id,
						...values,
					},
				},
				update: (store, { data: { createProjectBudgetTarget: projectCreated } }) => {
					try {
						const data = store.readQuery<IGET_BUDGET_TARGET_PROJECT>({
							query: GET_BUDGET_TARGET_PROJECT,
						});
						store.writeQuery<IGET_BUDGET_TARGET_PROJECT>({
							query: GET_BUDGET_TARGET_PROJECT,
							data: {
								budgetTargetsProjects: [
									...data!.budgetTargetsProjects,
									projectCreated,
								],
							},
						});
					} catch (err) {
						notificationDispatch(
							setErrorNotification("Budget Target Creation Failure")
						);
						props.handleClose();
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
			if (compObject(values, initialValues)) {
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
		<>
			<Dialog
				fullWidth
				maxWidth="md"
				open={props.open}
				onClose={props.handleClose}
				data-testid="create-budget-target-dialog"
				aria-labelledby="form-dialog-title"
			>
				<Box px={3} py={4}>
					<Grid container spacing={2}>
						<Grid item xs={4}>
							<DialogBoxSidebar
								title="New Budget Target"
								subtitle="Physical addresses of your organizatin like headquater, branch etc."
								workspace="WORKSPACE 1"
							/>
						</Grid>
						<Grid item xs={8}>
							<CommonInputForm
								initialValues={initialValues}
								validate={validate}
								onSubmit={onCreate}
								onCancel={props.handleClose}
								onUpdate={onUpdate}
								formAction={props.formAction}
								selectFields={createBudgetTargetFormSelectFields}
								inputFields={createBudgetTargetForm}
							/>
						</Grid>
					</Grid>
				</Box>
				{creatingProjectBudgetTarget || updatingProjectBudgetTarget ? (
					<Box position="fixed" bottom={0} alignSelf="center">
						<CircularProgress />
					</Box>
				) : null}
			</Dialog>
		</>
	);
}

export default CreateBudgetTargetProjectDialog;
