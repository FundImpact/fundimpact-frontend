import React, { useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import { Grid, CircularProgress } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import CreateBudgetTargetProjectForm from "../../Forms/CreateBudgetTargetForm";
import {
	GET_ORGANIZATION_BUDGET_CATEGORY,
	CREATE_PROJECT_BUDGET_TARGET,
	UPDATE_PROJECT_BUDGET_TARGET,
} from "../../../graphql/queries/budget";
import { GET_ORG_CURRENCIES } from "../../../graphql/queries";
import { GET_BUDGET_TARGET_PROJECT } from "../../../graphql/queries/budget";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { IBudgetTarget } from "../../../models/budget/budget";
import { IGET_BUDGET_TARGET_PROJECT } from "../../../models/budget/query";
import { ICreateBudgetTargetProjectDialogProps } from "../../../models/budget/budget";
import { BUDGET_ACTIONS } from "../../../models/budget/constants";

const defaultFormValues: IBudgetTarget = {
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

const validate = (values: IBudgetTarget) => {
	interface IBudgetTargetErrors {
		name: string;
		total_target_amount: string;
		description: string;
		conversion_factor: string;
		organization_currency: string;
		budget_category_organization: string;
	}

	let errors: Partial<IBudgetTargetErrors> = {};

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
	const [
		createProjectBudgetTarget,
		{
			data: createProjectBudgetTargetData,
			loading: creatingProjectBudgetTarget,
			error: createProjectBudgetTargetError,
		},
	] = useMutation(CREATE_PROJECT_BUDGET_TARGET);

	let initialValues =
		props.formAction == BUDGET_ACTIONS.CREATE ? defaultFormValues : props.initialValues;

	const [
		updateProjectBudgetTarget,
		{
			data: updateProjectBudgetTargetData,
			loading: updatingProjectBudgetTarget,
			error: updateProjectBudgetTargetError,
		},
	] = useMutation(UPDATE_PROJECT_BUDGET_TARGET);

	const { data: orgCurrencies } = useQuery(GET_ORG_CURRENCIES);
	const { data: budgetCategory } = useQuery(GET_ORGANIZATION_BUDGET_CATEGORY);
	const dashboardData = useDashBoardData();

	const onCreate = (values: IBudgetTarget) => {
		createProjectBudgetTarget({
			variables: {
				input: {
					project: dashboardData?.project?.id,
					...values,
				},
			},
			update: (store, { data: { createProjectBudgetTarget } }) => {
				try {
					const data = store.readQuery<IGET_BUDGET_TARGET_PROJECT>({
						query: GET_BUDGET_TARGET_PROJECT,
					});
					store.writeQuery<IGET_BUDGET_TARGET_PROJECT>({
						query: GET_BUDGET_TARGET_PROJECT,
						data: {
							budgetTargetsProjects: [
								...data!.budgetTargetsProjects,
								createProjectBudgetTarget,
							],
						},
					});
				} catch (err) {
					console.log("err :>> ", err);
				}
			},
		});

		props.handleClose();
	};

	const onUpdate = (values: IBudgetTarget) => {
		// budget_category_organization: values.budget_category,
		if (compObject(values, initialValues)) {
			props.handleClose();
			return;
		}

		delete values.id;

		updateProjectBudgetTarget({
			variables: {
				id: initialValues.id,
				input: {
					project: dashboardData?.project?.id,
					...values,
				},
			},
		});

		props.handleClose();
	};

	return (
		<>
			<Dialog
				fullWidth
				maxWidth="md"
				open={props.open}
				onClose={props.handleClose}
				data-testid="create-budget-dialog"
				aria-labelledby="form-dialog-title"
			>
				<Box px={3} py={4}>
					<Grid container spacing={2}>
						<Grid item xs={4}>
							<Typography
								data-testid="create-budget-dialog-header"
								variant="h6"
								gutterBottom
							>
								New Budget Target
							</Typography>
							<Typography variant="subtitle2" color="textSecondary" gutterBottom>
								Physical addresses of your organizatin like headquater, branch etc.
							</Typography>
							<Box p={3} mt={3} style={{ backgroundColor: "#F5F6FA" }}>
								<Typography color="primary" gutterBottom>
									WORKSPACE 1
								</Typography>
								<Box mt={1}>
									<Typography variant="subtitle2">Project Name One</Typography>
								</Box>
							</Box>
						</Grid>
						<Grid item xs={8}>
							<CreateBudgetTargetProjectForm
								initialValues={initialValues}
								validate={validate}
								onCreate={onCreate}
								onCancel={props.handleClose}
								onUpdate={onUpdate}
								formAction={props.formAction}
								organizationCurrencies={
									orgCurrencies?.orgCurrencies ? orgCurrencies.orgCurrencies : []
								}
								budgetCategory={
									budgetCategory?.orgBudgetCategory
										? budgetCategory.orgBudgetCategory
										: []
								}
							/>
						</Grid>
					</Grid>
				</Box>
				{creatingProjectBudgetTarget ? (
					<Box position="fixed" bottom={0} alignSelf="center">
						<CircularProgress />
					</Box>
				) : null}
			</Dialog>
		</>
	);
}

export default CreateBudgetTargetProjectDialog;
