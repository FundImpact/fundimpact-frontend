import React from "react";
import { useMutation } from "@apollo/client";
import { IBudget } from "../../../models/budget/budget";
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
import CommonDialog from "../../Dasboard/CommonDialog";
import CommonInputForm from "../../Forms/CommonInputForm/CommonInputForm";
import Project from "../../Project/Project";

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
	const [createNewOrgBudgetCategory, { loading }] = useMutation(CREATE_ORG_BUDGET_CATEGORY);

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
							variables: {
								filter: {
									project: dashboardData?.project?.id,
								},
							},
						});
						store.writeQuery<IGET_BUDGET_CATEGORY>({
							query: GET_ORGANIZATION_BUDGET_CATEGORY,
							variables: {
								filter: {
									project: dashboardData?.project?.id,
								},
							},
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
			<CommonDialog
				handleClose={handleClose}
				open={open}
				loading={loading}
				title="New Budget Category"
				subtitle="Physical addresses of your organizatin like headquater, branch etc."
				workspace="WORKSPACE 1"
			>
				<CommonInputForm
					initialValues={initialValues}
					validate={validate}
					onSubmit={onSubmit}
					onCancel={handleClose}
					inputFields={inputFields}
				/>
			</CommonDialog>
		</>
	);
}

export default CreateBudgetDialog;
