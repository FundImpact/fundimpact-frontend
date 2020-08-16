import React from "react";
import { useMutation } from "@apollo/client";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import { Grid, CircularProgress } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { IBudget } from "../../../models/budget/budget";
import CommonInputForm from "../../Forms/CommonInputForm";
import { CREATE_ORG_BUDGET_CATEGORY } from "../../../graphql/queries/budget";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { GET_ORGANIZATION_BUDGET_CATEGORY } from "../../../graphql/queries/budget";
import { IGET_BUDGET_CATEGORY } from "../../../models/budget/query";
import { useNotificationDispatch } from "../../../contexts/notificationContext";
import {
	setErrorNotification,
	setSuccessNotification,
} from "../../../reducers/notificationReducer";
import dataInputFields from "../../../utils/inputFields.json";
import { IInputField } from "../../../models";

let inputFields: IInputField[] = dataInputFields.createBudgetForm;

const initialValues: IBudget = {
	name: "",
	code: "",
	description: "",
};

const validate = (values: IBudget) => {
	let errors: Partial<IBudget> = {};
	if (!values.name) {
		errors.name = "Name is required";
	}
	if (!values.description) {
		errors.description = "Description is required";
	}
	if (!values.code) {
		errors.code = "Budget code is required";
	}
	return errors;
};

function CreateBudgetDialog({ open, handleClose }: { open: boolean; handleClose: () => void }) {
	const [createNewOrgBudgetCategory, { loading: createLoading }] = useMutation(
		CREATE_ORG_BUDGET_CATEGORY
	);

	const notificationDispatch = useNotificationDispatch();

	const dashboardData = useDashBoardData();

	const onSubmit = async (values: IBudget) => {
		try {
			await createNewOrgBudgetCategory({
				variables: {
					input: { ...values, organization: dashboardData?.organization?.id },
				},
				update: (store, { data: { createOrgBudgetCategory } }) => {
					try {
						const data = store.readQuery<IGET_BUDGET_CATEGORY>({
							query: GET_ORGANIZATION_BUDGET_CATEGORY,
						});
						store.writeQuery<IGET_BUDGET_CATEGORY>({
							query: GET_ORGANIZATION_BUDGET_CATEGORY,
							data: {
								orgBudgetCategory: [
									...data!.orgBudgetCategory,
									createOrgBudgetCategory,
								],
							},
						});
					} catch (err) {
						notificationDispatch(
							setErrorNotification("Budget Category Creation Failure")
						);
						handleClose();
					}
				},
			});
			notificationDispatch(setSuccessNotification("Budget Category Creation Success"));
			handleClose();
		} catch (err) {
			notificationDispatch(setErrorNotification("Budget Category Creation Failure"));
			handleClose();
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
								New Budget Category
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
							<CommonInputForm
								initialValues={initialValues}
								validate={validate}
								onSubmit={onSubmit}
								onCancel={handleClose}
								inputFields={inputFields}
							/>
						</Grid>
					</Grid>
				</Box>
				{createLoading ? (
					<Box position="fixed" bottom={0} alignSelf="center">
						<CircularProgress />
					</Box>
				) : null}
			</Dialog>
		</>
	);
}

export default CreateBudgetDialog;
