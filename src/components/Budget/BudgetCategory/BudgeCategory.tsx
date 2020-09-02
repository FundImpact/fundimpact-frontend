import { useMutation } from "@apollo/client";
import React from "react";

import { useDashBoardData } from "../../../contexts/dashboardContext";
import { useNotificationDispatch } from "../../../contexts/notificationContext";
import { GET_ORGANIZATION_BUDGET_CATEGORY } from "../../../graphql/Budget";
import { CREATE_ORG_BUDGET_CATEGORY } from "../../../graphql/Budget/mutation";
import { IInputField } from "../../../models";
import { IBudgetCategory } from "../../../models/budget";
import { IGET_BUDGET_CATEGORY } from "../../../models/budget/query";
import {
	setErrorNotification,
	setSuccessNotification,
} from "../../../reducers/notificationReducer";
import FormDialog from "../../FormDialog";
import CommonForm from "../../Forms/CommonForm";
import { budgetCategoryFormInputFields } from "./inputFields.json";
import { removeEmptyKeys } from "../../../utils";

let inputFields: IInputField[] = budgetCategoryFormInputFields;

const initialValues: IBudgetCategory = {
	name: "",
	code: "",
	description: "",
};

const validate = (values: IBudgetCategory) => {
	let errors: Partial<IBudgetCategory> = {};
	if (!values.name) {
		errors.name = "Name is required";
	}
	return errors;
};

function BudgetCategory({ open, handleClose }: { open: boolean; handleClose: () => void }) {
	const [createNewOrgBudgetCategory, { loading }] = useMutation(CREATE_ORG_BUDGET_CATEGORY);

	const notificationDispatch = useNotificationDispatch();

	const dashboardData = useDashBoardData();

	const onSubmit = async (valuesSubmitted: IBudgetCategory) => {
		let values = removeEmptyKeys<IBudgetCategory>(valuesSubmitted);
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
									organization: dashboardData?.organization?.id,
								},
							},
						});
						let budgetCategory: Partial<IBudgetCategory>[] = data?.orgBudgetCategory
							? data?.orgBudgetCategory
							: [];
						store.writeQuery<IGET_BUDGET_CATEGORY>({
							query: GET_ORGANIZATION_BUDGET_CATEGORY,
							variables: {
								filter: {
									organization: dashboardData?.organization?.id,
								},
							},
							data: {
								orgBudgetCategory: [createOrgBudgetCategory, ...budgetCategory],
							},
						});
					} catch (err) {}
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
			<FormDialog
				handleClose={handleClose}
				open={open}
				loading={loading}
				title="New Budget Category"
				subtitle="Physical addresses of your organizatin like headquater, branch etc."
				workspace={dashboardData?.workspace?.name}
				project={dashboardData?.project?.name ? dashboardData?.project?.name : ""}
			>
				<CommonForm
					initialValues={initialValues}
					validate={validate}
					onSubmit={onSubmit}
					onCancel={handleClose}
					inputFields={inputFields}
				/>
			</FormDialog>
		</>
	);
}

export default BudgetCategory;
