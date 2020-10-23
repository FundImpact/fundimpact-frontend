import { useMutation } from "@apollo/client";
import React from "react";
import { useIntl } from "react-intl";

import { useDashBoardData } from "../../../contexts/dashboardContext";
import { useNotificationDispatch } from "../../../contexts/notificationContext";
import {
	GET_ORG_BUDGET_CATEGORY_COUNT,
	GET_ORGANIZATION_BUDGET_CATEGORY,
} from "../../../graphql/Budget";
import {
	CREATE_ORG_BUDGET_CATEGORY,
	UPDATE_ORG_BUDGET_CATEGORY,
} from "../../../graphql/Budget/mutation";
import { IInputField } from "../../../models";
import { IBudgetCategory, IBudgetCategoryProps } from "../../../models/budget";
import { IGET_BUDGET_CATEGORY } from "../../../models/budget/query";
import { FORM_ACTIONS } from "../../../models/constants";
import {
	setErrorNotification,
	setSuccessNotification,
} from "../../../reducers/notificationReducer";
import { compareObjectKeys, removeEmptyKeys } from "../../../utils";
import { CommonFormTitleFormattedMessage } from "../../../utils/commonFormattedMessage";
import FormDialog from "../../FormDialog";
import CommonForm from "../../Forms/CommonForm";
import { budgetCategoryFormInputFields } from "./inputFields.json";

let inputFields: IInputField[] = budgetCategoryFormInputFields;

let defaultFormValues: IBudgetCategory = {
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

function BudgetCategory({
	open,
	handleClose,
	initialValues: formValues,
	formAction,
}: IBudgetCategoryProps) {
	const [createNewOrgBudgetCategory, { loading: creatingBudgetCategory }] = useMutation(
		CREATE_ORG_BUDGET_CATEGORY
	);
	const [updateBudgetCategory, { loading: updatingBudgetCategory }] = useMutation(
		UPDATE_ORG_BUDGET_CATEGORY
	);

	const notificationDispatch = useNotificationDispatch();

	const dashboardData = useDashBoardData();

	let initialValues = formAction === FORM_ACTIONS.CREATE ? defaultFormValues : formValues;

	const onSubmit = async (valuesSubmitted: IBudgetCategory) => {
		let values = removeEmptyKeys<IBudgetCategory>({ objectToCheck: valuesSubmitted });
		try {
			await createNewOrgBudgetCategory({
				variables: {
					input: { ...values, organization: dashboardData?.organization?.id },
				},
				update: async (store, { data: { createOrgBudgetCategory } }) => {
					try {
						const count = await store.readQuery<{ orgBudgetCategoryCount: number }>({
							query: GET_ORG_BUDGET_CATEGORY_COUNT,
							variables: {
								filter: {
									organization: dashboardData?.organization?.id,
								},
							},
						});

						store.writeQuery<{ orgBudgetCategoryCount: number }>({
							query: GET_ORG_BUDGET_CATEGORY_COUNT,
							variables: {
								filter: {
									organization: dashboardData?.organization?.id,
								},
							},
							data: {
								orgBudgetCategoryCount:
									(count && count.orgBudgetCategoryCount + 1) || 0,
							},
						});

						let limit = 0;
						if (count) {
							limit = count.orgBudgetCategoryCount;
						}
						const dataRead = await store.readQuery<IGET_BUDGET_CATEGORY>({
							query: GET_ORGANIZATION_BUDGET_CATEGORY,
							variables: {
								filter: {
									organization: dashboardData?.organization?.id,
								},
								limit: limit > 10 ? 10 : limit,
								start: 0,
								sort: "created_at:DESC",
							},
						});
						let budgetCategories: Partial<
							IBudgetCategory
						>[] = dataRead?.orgBudgetCategory ? dataRead?.orgBudgetCategory : [];

						store.writeQuery<IGET_BUDGET_CATEGORY>({
							query: GET_ORGANIZATION_BUDGET_CATEGORY,
							variables: {
								filter: {
									organization: dashboardData?.organization?.id,
								},
								limit: limit > 10 ? 10 : limit,
								start: 0,
								sort: "created_at:DESC",
							},
							data: {
								orgBudgetCategory: [createOrgBudgetCategory, ...budgetCategories],
							},
						});
					} catch (err) {
						console.error(err)
					}

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
					} catch (err) {
						console.error(err)
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

	const onUpdate = async (valuesSubmitted: IBudgetCategory) => {
		try {
			let values = removeEmptyKeys<IBudgetCategory>({
				objectToCheck: valuesSubmitted,
				keysToRemainUnchecked: {
					description: 1,
				},
			});

			if (compareObjectKeys(values, initialValues)) {
				handleClose();
				return;
			}
			delete values.id;

			await updateBudgetCategory({
				variables: {
					id: initialValues?.id,
					input: {
						...values,
						organization: dashboardData?.organization?.id,
					},
				},
			});
			notificationDispatch(setSuccessNotification("Budget Category Updation Success"));
		} catch (err) {
			notificationDispatch(setErrorNotification("Budget Category Updation Failure"));
		} finally {
			handleClose();
		}
	};
	const intl = useIntl();
	let { newOrEdit } = CommonFormTitleFormattedMessage(formAction);
	return (
		<>
			<FormDialog
				handleClose={handleClose}
				open={open}
				loading={updatingBudgetCategory || creatingBudgetCategory}
				title={
					newOrEdit +
					" " +
					intl.formatMessage({
						id: "budgetCategoryFormTitle",
						defaultMessage: "Budget Category",
						description: `This text will be show on Budget category form for title`,
					})
				}
				subtitle={intl.formatMessage({
					id: "budgetCategoryFormSubtitle",
					defaultMessage: "Manage Budget Category",
					description: `This text will be show on Budget category form for subtitle`,
				})}
				workspace={dashboardData?.workspace?.name}
				project={dashboardData?.project?.name ? dashboardData?.project?.name : ""}
			>
				<CommonForm
					initialValues={initialValues}
					validate={validate}
					onSubmit={onSubmit}
					onCancel={handleClose}
					inputFields={inputFields}
					formAction={formAction}
					onUpdate={onUpdate}
				/>
			</FormDialog>
		</>
	);
}

export default BudgetCategory;
