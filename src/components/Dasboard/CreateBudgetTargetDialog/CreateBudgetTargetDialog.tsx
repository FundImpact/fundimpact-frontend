import React, { useEffect } from "react";
import { useMutation, useQuery, useApolloClient } from "@apollo/client";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import { Grid, CircularProgress } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import CreateBudgetTargetProjectForm from "../../Forms/CreateBudgetTargetForm";
import {
	GET_ORGANIZATION_BUDGET_CATEGORY,
	CREATE_PROJECT_BUDGET_TARGET,
} from "../../../graphql/queries/budget";
import { GET_ORG_CURRENCIES } from "../../../graphql/queries";
import { GET_BUDGET_TARGET_PROJECT } from "../../../graphql/queries/budget";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { IBudgetTarget } from "../../../models/budget/budget";
import { IGET_BUDGET_TARGET_PROJECT } from "../../../models/budget/query";

const initialValues: IBudgetTarget = {
	name: "",
	total_target_amount: "",
	description: "",
	conversion_factor: "",
	organizationCurrencyId: "",
	budget_category: "",
};

const validate = (values: IBudgetTarget) => {
	interface IBudgetTargetErrors {
		name: string;
		total_target_amount: string;
		description: string;
		conversion_factor: string;
		organizationCurrencyId: string;
		budget_category: string;
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
	if (!values.budget_category) {
		errors.budget_category = "Budget Category is required";
	}
	if (!values.organizationCurrencyId) {
		errors.organizationCurrencyId = "Organization Currency is required";
	}
	return errors;
};

function CreateBudgetTargetProjectDialog({
	open,
	handleClose,
}: {
	open: boolean;
	handleClose: () => void;
}) {
	const [
		createProjectBudgetTarget,
		{
			data: projectBudgetTarget,
			loading: creatingProjectBudgetTarget,
			error: createProjectBudgetTargetError,
			client,
		},
	] = useMutation(CREATE_PROJECT_BUDGET_TARGET);

	const apolloClient = useApolloClient();

	const { data: orgCurrencies } = useQuery(GET_ORG_CURRENCIES);
	const { data: budgetCategory } = useQuery(GET_ORGANIZATION_BUDGET_CATEGORY);
	const dashboardData = useDashBoardData();

	const onSubmit = async (values: IBudgetTarget) => {
		try {
			const { data } = await createProjectBudgetTarget({
				variables: {
					input: {
						project: "3",
						name: values.name,
						description: values.description,
						total_target_amount: values.total_target_amount,
						conversion_factor: values.conversion_factor,
						organization_currency: values.organizationCurrencyId,
						// budget_category_organization: values.budget_category,
					},
				},
			});

			const oldCachedData = apolloClient.readQuery<IGET_BUDGET_TARGET_PROJECT>({
				query: GET_BUDGET_TARGET_PROJECT,
			});

			apolloClient.writeQuery({
				query: GET_BUDGET_TARGET_PROJECT,
				data: {
					budgetTargetsProjects: [
						oldCachedData && oldCachedData.budgetTargetsProjects
							? oldCachedData.budgetTargetsProjects.map((ele) => ele)
							: [],
						{
							description: data.createProjectBudgetTarget.description,
							project: data.createProjectBudgetTarget.project,
							total_target_amount: data.createProjectBudgetTarget.total_target_amount,
							name: data.createProjectBudgetTarget.name,
							organization_currency:
								data.createProjectBudgetTarget.organization_currency,
							conversion_factor: data.createProjectBudgetTarget.conversion_factor,
						},
					],
				},
			});
			handleClose();
		} catch (err) {
			console.log("err :>> ", err);
		}
	};

	return (
		<>
			<Dialog
				fullWidth
				maxWidth="md"
				open={open}
				onClose={handleClose}
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
								onSubmit={onSubmit}
								onCancel={handleClose}
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
