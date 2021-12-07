import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
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
import { DIALOG_TYPE, FORM_ACTIONS } from "../../../models/constants";
import {
	setErrorNotification,
	setSuccessNotification,
} from "../../../reducers/notificationReducer";
import { compareObjectKeys, removeEmptyKeys } from "../../../utils";
import { CommonFormTitleFormattedMessage } from "../../../utils/commonFormattedMessage";
import FormDialog from "../../FormDialog";
import CommonForm from "../../CommonForm";
import { budgetCategoryFormInputFields } from "./inputFields.json";
import DeleteModal from "../../DeleteModal";
import { GET_PROJECTS } from "../../../graphql";

let inputFields: IInputField[] = budgetCategoryFormInputFields;

let defaultFormValues: IBudgetCategory = {
	name: "",
	code: "",
	description: "",
	is_project: false,
	project_id: "",
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
	getCreatedBudgetCategory,
	dialogType,
}: IBudgetCategoryProps) {
	const [currentIsProject, setCurrentIsProject] = useState<boolean>(false);
	const [createNewOrgBudgetCategory, { loading: creatingBudgetCategory }] = useMutation(
		CREATE_ORG_BUDGET_CATEGORY
	);
	const [updateBudgetCategory, { loading: updatingBudgetCategory }] = useMutation(
		UPDATE_ORG_BUDGET_CATEGORY
	);

	const { data: projectList } = useQuery(GET_PROJECTS);

	useEffect(() => {
		if (projectList) {
			budgetCategoryFormInputFields[4].optionsArray = projectList?.orgProject;
		}
	}, [projectList]);

	const notificationDispatch = useNotificationDispatch();

	const dashboardData = useDashBoardData();

	let initialValues = formAction === FORM_ACTIONS.CREATE ? defaultFormValues : formValues;

	const onSubmit = async (valuesSubmitted: IBudgetCategory) => {
		let values = removeEmptyKeys<IBudgetCategory>({ objectToCheck: valuesSubmitted });

		try {
			delete values.is_project;
			await createNewOrgBudgetCategory({
				variables: {
					input: { ...values, organization: dashboardData?.organization?.id },
				},
				update: async (store, { data: { createOrgBudgetCategory } }) => {
					try {
						if (getCreatedBudgetCategory) {
							getCreatedBudgetCategory(createOrgBudgetCategory);
						}

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
									project_id: dashboardData?.project?.id,
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
									project_id: dashboardData?.project?.id,
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
						// console.error(err);
					}

					try {
						const data = store.readQuery<IGET_BUDGET_CATEGORY>({
							query: GET_ORGANIZATION_BUDGET_CATEGORY,
							variables: {
								filter: {
									organization: dashboardData?.organization?.id,
									project_id: dashboardData?.project?.id,
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
									project_id: dashboardData?.project?.id,
								},
							},
							data: {
								orgBudgetCategory: [createOrgBudgetCategory, ...budgetCategory],
							},
						});
					} catch (err) {
						// console.error(err);
					}
				},
			});
			notificationDispatch(setSuccessNotification("Budget Category Creation Success"));
			handleClose();
		} catch (err: any) {
			notificationDispatch(setErrorNotification(err?.message));
			handleClose();
		}
	};

	budgetCategoryFormInputFields[3].getInputValue = (value: boolean) => {
		setCurrentIsProject(value);
		// value
		// 	? (budgetCategoryFormInputFields[4].hidden = false)
		// 	: (budgetCategoryFormInputFields[4].hidden = true);
	};

	currentIsProject
		? (budgetCategoryFormInputFields[4].hidden = false)
		: (budgetCategoryFormInputFields[4].hidden = true);

	if (formValues?.project_id && formAction === "UPDATE") {
		formValues.is_project = true;
		budgetCategoryFormInputFields[4].disabled = true;
		budgetCategoryFormInputFields[4].hidden = false;
		budgetCategoryFormInputFields[3].hidden = false;
	}

	if (!formValues?.project_id && formAction === "UPDATE") {
		budgetCategoryFormInputFields[3].hidden = true;
		budgetCategoryFormInputFields[4].hidden = true;
	}
	if (formAction === "CREATE") {
		budgetCategoryFormInputFields[3].hidden = false;
		budgetCategoryFormInputFields[4].disabled = false;
	}
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
			delete values.is_project;

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
		} catch (err: any) {
			notificationDispatch(setErrorNotification(err?.message));
		} finally {
			handleClose();
		}
	};

	const onDelete = async () => {
		try {
			const budgetCategoryValues: any = { ...initialValues };
			delete budgetCategoryValues["id"];
			delete budgetCategoryValues.is_project;
			await updateBudgetCategory({
				variables: {
					id: initialValues?.id,
					name: initialValues?.name,
					input: {
						deleted: true,
						name: initialValues?.name,
						// ...budgetCategoryValues,
						// organization: dashboardData?.organization?.id,
					},
				},
				refetchQueries: [
					{
						query: GET_ORG_BUDGET_CATEGORY_COUNT,
						variables: {
							filter: {
								organization: dashboardData?.organization?.id,
							},
						},
					},
				],
			});
			notificationDispatch(setSuccessNotification("Budget Category Delete Success"));
		} catch (err: any) {
			notificationDispatch(setErrorNotification(err.message));
		} finally {
			handleClose();
		}
	};

	const intl = useIntl();
	let { newOrEdit } = CommonFormTitleFormattedMessage(formAction);

	const updateBudgetCategorySubtitle = intl.formatMessage({
		id: "BudgetCategoryUpdateFormSubtitle",
		defaultMessage: "Update Budget Category Of Organization",
		description: `This text will be show on update budget category form`,
	});

	const createBudgetCategorySubtitle = intl.formatMessage({
		id: "BudgetCategoryCreateFormSubtitle",
		defaultMessage: "Create New Budget Category For Organization",
		description: `This text will be show on create budget category form`,
	});

	if (dialogType === DIALOG_TYPE.DELETE) {
		return (
			<DeleteModal
				open={open}
				handleClose={handleClose}
				title="Budget Category"
				onDeleteConformation={onDelete}
			/>
		);
	}

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
				subtitle={
					formAction === FORM_ACTIONS.CREATE
						? createBudgetCategorySubtitle
						: updateBudgetCategorySubtitle
				}
				workspace={""}
				project={""}
			>
				<CommonForm
					initialValues={initialValues}
					validate={validate}
					onCreate={onSubmit}
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
